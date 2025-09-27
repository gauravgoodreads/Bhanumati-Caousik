import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    adminId?: string;
  }
}
import {
  insertServiceSchema,
  insertPackageSchema,
  insertBlogPostSchema,
  insertTestimonialSchema,
  insertWorkshopSchema,
  insertWorkshopBookingSchema,
  insertPackageInquirySchema,
  insertContactMessageSchema,
  createOrderSchema,
  verifyPaymentSchema,
} from '@shared/schema';

// PostgreSQL session store
const PgSession = connectPgSimple(session);

// Session middleware for admin authentication
const sessionMiddleware = session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production');
    }
    console.warn('Warning: Using fallback session secret. Set SESSION_SECRET environment variable.');
    return 'fallback-secret-key-development-only';
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.adminId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Validation middleware
function validateBody(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Trust proxy for secure cookies behind reverse proxy
  app.set('trust proxy', 1);
  
  // Configure session middleware
  app.use(sessionMiddleware);

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.getAdminUserByEmail(email);
      if (!admin || !admin.isActive || !await bcrypt.compare(password, admin.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Regenerate session ID to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed' });
        }

        req.session.adminId = admin.id;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: 'Login failed' });
          }

          // Update last login time
          storage.updateAdminUser(admin.id, { 
            isActive: true
          }).catch(console.error);

          res.json({ 
            message: 'Login successful', 
            admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } 
          });
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session?.adminId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      // Find admin by ID stored in session (proper source of truth)
      const admin = await storage.getAdminUserById(req.session.adminId);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ error: 'Admin not found or inactive' });
      }
      
      res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
      console.error('Auth me error:', error);
      res.status(500).json({ error: 'Failed to get user info' });
    }
  });

  // Services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get services' });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const service = await storage.getServiceById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get service' });
    }
  });

  app.post('/api/services', requireAuth, validateBody(insertServiceSchema), async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create service' });
    }
  });

  app.put('/api/services/:id', requireAuth, validateBody(insertServiceSchema.partial()), async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  app.delete('/api/services/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteService(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });

  // Packages routes
  app.get('/api/packages', async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get packages' });
    }
  });

  app.get('/api/packages/:id', async (req, res) => {
    try {
      const pkg = await storage.getPackageById(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get package' });
    }
  });

  app.post('/api/packages', requireAuth, validateBody(insertPackageSchema), async (req, res) => {
    try {
      const pkg = await storage.createPackage(req.body);
      res.status(201).json(pkg);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create package' });
    }
  });

  app.put('/api/packages/:id', requireAuth, validateBody(insertPackageSchema.partial()), async (req, res) => {
    try {
      const pkg = await storage.updatePackage(req.params.id, req.body);
      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update package' });
    }
  });

  app.delete('/api/packages/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deletePackage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Package not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete package' });
    }
  });

  // Blog Posts routes
  app.get('/api/blog', async (req, res) => {
    try {
      const published = req.query.published !== 'false';
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get blog posts' });
    }
  });

  app.get('/api/blog/:id', async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // Increment view count for published posts
      if (post.isPublished) {
        await storage.incrementBlogPostViews(req.params.id);
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get blog post' });
    }
  });

  app.get('/api/blog/slug/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // Increment view count for published posts
      if (post.isPublished) {
        await storage.incrementBlogPostViews(post.id);
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get blog post' });
    }
  });

  app.post('/api/blog', requireAuth, validateBody(insertBlogPostSchema), async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  });

  app.put('/api/blog/:id', requireAuth, validateBody(insertBlogPostSchema.partial()), async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  });

  app.delete('/api/blog/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  });

  // Testimonials routes
  app.get('/api/testimonials', async (req, res) => {
    try {
      const activeOnly = req.query.active !== 'false';
      const testimonials = await storage.getTestimonials(activeOnly);
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get testimonials' });
    }
  });

  app.get('/api/testimonials/:id', async (req, res) => {
    try {
      const testimonial = await storage.getTestimonialById(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get testimonial' });
    }
  });

  app.post('/api/testimonials', requireAuth, validateBody(insertTestimonialSchema), async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  });

  app.put('/api/testimonials/:id', requireAuth, validateBody(insertTestimonialSchema.partial()), async (req, res) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update testimonial' });
    }
  });

  app.delete('/api/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  });

  // Workshops routes
  app.get('/api/workshops', async (req, res) => {
    try {
      const activeOnly = req.query.active !== 'false';
      const workshops = await storage.getWorkshops(activeOnly);
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workshops' });
    }
  });

  app.get('/api/workshops/upcoming', async (req, res) => {
    try {
      const workshops = await storage.getUpcomingWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get upcoming workshops' });
    }
  });

  app.get('/api/workshops/:id', async (req, res) => {
    try {
      const workshop = await storage.getWorkshopById(req.params.id);
      if (!workshop) {
        return res.status(404).json({ error: 'Workshop not found' });
      }
      res.json(workshop);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workshop' });
    }
  });

  app.post('/api/workshops', requireAuth, validateBody(insertWorkshopSchema), async (req, res) => {
    try {
      const workshop = await storage.createWorkshop(req.body);
      res.status(201).json(workshop);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create workshop' });
    }
  });

  app.put('/api/workshops/:id', requireAuth, validateBody(insertWorkshopSchema.partial()), async (req, res) => {
    try {
      const workshop = await storage.updateWorkshop(req.params.id, req.body);
      if (!workshop) {
        return res.status(404).json({ error: 'Workshop not found' });
      }
      res.json(workshop);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update workshop' });
    }
  });

  app.delete('/api/workshops/:id', requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteWorkshop(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Workshop not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete workshop' });
    }
  });

  // Workshop Bookings routes
  app.get('/api/workshop-bookings', requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getWorkshopBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workshop bookings' });
    }
  });

  app.get('/api/workshop-bookings/workshop/:workshopId', requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getWorkshopBookingsByWorkshop(req.params.workshopId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workshop bookings' });
    }
  });

  app.post('/api/workshop-bookings', validateBody(insertWorkshopBookingSchema), async (req, res) => {
    try {
      const booking = await storage.createWorkshopBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create workshop booking' });
    }
  });

  app.put('/api/workshop-bookings/:id', requireAuth, validateBody(insertWorkshopBookingSchema.partial()), async (req, res) => {
    try {
      const booking = await storage.updateWorkshopBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: 'Workshop booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update workshop booking' });
    }
  });

  // Package Inquiries routes
  app.get('/api/package-inquiries', requireAuth, async (req, res) => {
    try {
      const inquiries = await storage.getPackageInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get package inquiries' });
    }
  });

  app.post('/api/package-inquiries', validateBody(insertPackageInquirySchema), async (req, res) => {
    try {
      const inquiry = await storage.createPackageInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create package inquiry' });
    }
  });

  app.put('/api/package-inquiries/:id', requireAuth, validateBody(insertPackageInquirySchema.partial()), async (req, res) => {
    try {
      const inquiry = await storage.updatePackageInquiry(req.params.id, req.body);
      if (!inquiry) {
        return res.status(404).json({ error: 'Package inquiry not found' });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update package inquiry' });
    }
  });

  // Contact Messages routes
  app.get('/api/contact-messages', requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get contact messages' });
    }
  });

  app.post('/api/contact-messages', validateBody(insertContactMessageSchema), async (req, res) => {
    try {
      const message = await storage.createContactMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create contact message' });
    }
  });

  // Payment Routes
  app.post('/api/payment/create-order', validateBody(createOrderSchema), async (req, res) => {
    try {
      const { amount, currency, receipt, notes } = req.body;

      // Verify the item exists and get its actual price
      let actualAmount: number;
      
      if (notes.type === 'package') {
        const packageItem = await storage.getPackageById(notes.itemId);
        if (!packageItem || !packageItem.isActive) {
          return res.status(404).json({ error: 'Package not found or inactive' });
        }
        actualAmount = parseFloat(packageItem.price);
      } else if (notes.type === 'workshop') {
        const workshop = await storage.getWorkshopById(notes.itemId);
        if (!workshop || !workshop.isActive) {
          return res.status(404).json({ error: 'Workshop not found or inactive' });
        }
        actualAmount = parseFloat(workshop.price);
      } else {
        return res.status(400).json({ error: 'Invalid item type' });
      }

      // Verify the amount matches the server-side price (prevent client-side manipulation)
      if (Math.abs(amount - actualAmount) > 0.01) {
        return res.status(400).json({ error: 'Amount mismatch with server price' });
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(actualAmount * 100), // Use server-side amount, convert to paise
        currency,
        receipt: receipt || `ord_${Date.now()}`,
        notes
      });

      // Store payment order in database for verification tracking
      await storage.createPaymentOrder({
        razorpayOrderId: order.id,
        itemType: notes.type,
        itemId: notes.itemId,
        expectedAmount: actualAmount.toString(),
        currency,
        customerData: {} // Will be updated during verification
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error('Payment order creation failed:', error);
      res.status(500).json({ error: 'Failed to create payment order' });
    }
  });

  app.post('/api/payment/verify', validateBody(verifyPaymentSchema), async (req, res) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        customerData 
      } = req.body;
      
      // NOTE: We ignore client-supplied type and itemId for security - use only server-side data

      // Get the stored payment order to verify server-side tracking
      const paymentOrder = await storage.getPaymentOrderByRazorpayId(razorpay_order_id);
      if (!paymentOrder) {
        return res.status(400).json({ error: 'Payment order not found' });
      }

      // Strict idempotency check - prevent duplicate processing
      if (paymentOrder.status === 'completed' || paymentOrder.status === 'verified') {
        return res.json({
          message: 'Payment already processed',
          type: paymentOrder.itemType,
          alreadyProcessed: true
        });
      }

      // Verify payment signature using constant-time comparison
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      // Use crypto.timingSafeEqual for constant-time comparison to prevent timing attacks
      if (digest.length !== razorpay_signature.length || 
          !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(razorpay_signature))) {
        await storage.updatePaymentOrderStatus(paymentOrder.id, 'failed');
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Re-verify the item still exists and get current price for security
      let currentItem: any;
      let currentAmount: number;
      
      if (paymentOrder.itemType === 'package') {
        currentItem = await storage.getPackageById(paymentOrder.itemId);
        if (!currentItem || !currentItem.isActive) {
          await storage.updatePaymentOrderStatus(paymentOrder.id, 'failed');
          return res.status(404).json({ error: 'Package not found or inactive' });
        }
        currentAmount = parseFloat(currentItem.price);
      } else if (paymentOrder.itemType === 'workshop') {
        currentItem = await storage.getWorkshopById(paymentOrder.itemId);
        if (!currentItem || !currentItem.isActive) {
          await storage.updatePaymentOrderStatus(paymentOrder.id, 'failed');
          return res.status(404).json({ error: 'Workshop not found or inactive' });
        }
        currentAmount = parseFloat(currentItem.price);
      } else {
        await storage.updatePaymentOrderStatus(paymentOrder.id, 'failed');
        return res.status(400).json({ error: 'Invalid item type in stored order' });
      }

      // Verify the stored payment amount matches current item price
      const storedAmount = parseFloat(paymentOrder.expectedAmount);
      if (Math.abs(currentAmount - storedAmount) > 0.01) {
        await storage.updatePaymentOrderStatus(paymentOrder.id, 'failed');
        return res.status(400).json({ error: 'Payment amount mismatch with current price' });
      }

      // Update payment order with customer data and mark as verified  
      await storage.updatePaymentOrderStatus(paymentOrder.id, 'verified', razorpay_payment_id);

      // Payment verified, now create booking/inquiry based on stored order data
      if (paymentOrder.itemType === 'workshop') {
        // Create workshop booking using verified server-side data

        const booking = await storage.createWorkshopBooking({
          workshopId: paymentOrder.itemId,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          amount: paymentOrder.expectedAmount,
          specialRequests: customerData.specialRequests || null
        });

        // Update payment status and ID
        await storage.updateWorkshopBookingPayment(booking.id, 'completed', razorpay_payment_id);
        await storage.updatePaymentOrderStatus(paymentOrder.id, 'completed', razorpay_payment_id);

        res.json({ 
          message: 'Workshop booking successful',
          bookingId: booking.id,
          type: 'workshop'
        });

      } else if (paymentOrder.itemType === 'package') {
        // Create package inquiry with payment completed using verified server-side data

        const inquiry = await storage.createPackageInquiry({
          packageId: paymentOrder.itemId,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          message: `Payment completed for ${currentItem.title}. Payment ID: ${razorpay_payment_id}`
        });

        await storage.updatePaymentOrderStatus(paymentOrder.id, 'completed', razorpay_payment_id);

        res.json({ 
          message: 'Package payment successful',
          inquiryId: inquiry.id,
          type: 'package'
        });
      }

    } catch (error) {
      console.error('Payment verification failed:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  });

  app.put('/api/contact-messages/:id', requireAuth, validateBody(insertContactMessageSchema.partial()), async (req, res) => {
    try {
      const message = await storage.updateContactMessage(req.params.id, req.body);
      if (!message) {
        return res.status(404).json({ error: 'Contact message not found' });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update contact message' });
    }
  });

  // Admin-specific routes (include inactive items)
  app.get('/api/admin/services', requireAuth, async (req, res) => {
    try {
      const services = await storage.getAllServices(); // Get all services including inactive
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get services' });
    }
  });

  app.get('/api/admin/packages', requireAuth, async (req, res) => {
    try {
      const packages = await storage.getAllPackages(); // Get all packages including inactive
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get packages' });
    }
  });

  app.get('/api/admin/blog', requireAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false); // Get all posts, including unpublished
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get blog posts' });
    }
  });

  app.get('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials(false); // Get all testimonials, including inactive
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get testimonials' });
    }
  });

  app.get('/api/admin/workshop-bookings', requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getWorkshopBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workshop bookings' });
    }
  });

  app.get('/api/admin/package-inquiries', requireAuth, async (req, res) => {
    try {
      const inquiries = await storage.getPackageInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get package inquiries' });
    }
  });

  app.get('/api/admin/payment-orders', requireAuth, async (req, res) => {
    try {
      const orders = await storage.getPaymentOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get payment orders' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
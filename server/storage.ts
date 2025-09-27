import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc, sql, and, or } from 'drizzle-orm';
import * as schema from '@shared/schema';
import type {
  Service, InsertService,
  Package, InsertPackage,
  BlogPost, InsertBlogPost,
  Testimonial, InsertTestimonial,
  Workshop, InsertWorkshop,
  WorkshopBooking, InsertWorkshopBooking,
  PackageInquiry, InsertPackageInquiry,
  ContactMessage, InsertContactMessage,
  AdminUser, InsertAdminUser,
  PaymentOrder, InsertPaymentOrder
} from '@shared/schema';

const sql_client = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_client, { schema });

export interface IStorage {
  // Services
  getServices(): Promise<Service[]>;
  getAllServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | null>;
  deleteService(id: string): Promise<boolean>;

  // Packages
  getPackages(): Promise<Package[]>;
  getAllPackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | null>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | null>;
  deletePackage(id: string): Promise<boolean>;

  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | null>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | null>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogPostViews(id: string): Promise<void>;

  // Testimonials
  getTestimonials(activeOnly?: boolean): Promise<Testimonial[]>;
  getTestimonialById(id: string): Promise<Testimonial | null>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | null>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Workshops
  getWorkshops(activeOnly?: boolean): Promise<Workshop[]>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getUpcomingWorkshops(): Promise<Workshop[]>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshop(id: string, workshop: Partial<InsertWorkshop>): Promise<Workshop | null>;
  deleteWorkshop(id: string): Promise<boolean>;

  // Workshop Bookings
  getWorkshopBookings(): Promise<WorkshopBooking[]>;
  getWorkshopBookingById(id: string): Promise<WorkshopBooking | null>;
  getWorkshopBookingsByWorkshop(workshopId: string): Promise<WorkshopBooking[]>;
  createWorkshopBooking(booking: InsertWorkshopBooking): Promise<WorkshopBooking>;
  updateWorkshopBooking(id: string, booking: Partial<InsertWorkshopBooking>): Promise<WorkshopBooking | null>;
  updateWorkshopBookingPayment(id: string, paymentStatus: string, paymentId: string): Promise<WorkshopBooking | null>;

  // Package Inquiries
  getPackageInquiries(): Promise<PackageInquiry[]>;
  getPackageInquiryById(id: string): Promise<PackageInquiry | null>;
  createPackageInquiry(inquiry: InsertPackageInquiry): Promise<PackageInquiry>;
  updatePackageInquiry(id: string, inquiry: Partial<InsertPackageInquiry>): Promise<PackageInquiry | null>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: string): Promise<ContactMessage | null>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | null>;

  // Admin Users
  getAdminUserByEmail(email: string): Promise<AdminUser | null>;
  getAdminUserById(id: string): Promise<AdminUser | null>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | null>;

  // Payment Orders
  getPaymentOrders(): Promise<PaymentOrder[]>;
  createPaymentOrder(order: InsertPaymentOrder): Promise<PaymentOrder>;
  getPaymentOrderByRazorpayId(razorpayOrderId: string): Promise<PaymentOrder | null>;
  updatePaymentOrderStatus(id: string, status: string, paymentId?: string): Promise<PaymentOrder | null>;
}

export class DbStorage implements IStorage {
  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(schema.services)
      .where(eq(schema.services.isActive, true))
      .orderBy(schema.services.sortOrder, schema.services.createdAt);
  }

  async getAllServices(): Promise<Service[]> {
    return await db.select().from(schema.services)
      .orderBy(schema.services.sortOrder, schema.services.createdAt);
  }

  async getServiceById(id: string): Promise<Service | null> {
    const results = await db.select().from(schema.services)
      .where(eq(schema.services.id, id));
    return results[0] || null;
  }

  async createService(service: InsertService): Promise<Service> {
    const results = await db.insert(schema.services)
      .values({
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | null> {
    const results = await db.update(schema.services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(schema.services.id, id))
      .returning();
    return results[0] || null;
  }

  async deleteService(id: string): Promise<boolean> {
    const results = await db.delete(schema.services)
      .where(eq(schema.services.id, id));
    return results.rowCount > 0;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return await db.select().from(schema.packages)
      .where(eq(schema.packages.isActive, true))
      .orderBy(schema.packages.sortOrder, schema.packages.createdAt);
  }

  async getAllPackages(): Promise<Package[]> {
    return await db.select().from(schema.packages)
      .orderBy(schema.packages.sortOrder, schema.packages.createdAt);
  }

  async getPackageById(id: string): Promise<Package | null> {
    const results = await db.select().from(schema.packages)
      .where(eq(schema.packages.id, id));
    return results[0] || null;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const results = await db.insert(schema.packages)
      .values({
        ...pkg,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | null> {
    const results = await db.update(schema.packages)
      .set({ ...pkg, updatedAt: new Date() })
      .where(eq(schema.packages.id, id))
      .returning();
    return results[0] || null;
  }

  async deletePackage(id: string): Promise<boolean> {
    const results = await db.delete(schema.packages)
      .where(eq(schema.packages.id, id));
    return results.rowCount > 0;
  }

  // Blog Posts
  async getBlogPosts(published = true): Promise<BlogPost[]> {
    const conditions = published ? eq(schema.blogPosts.isPublished, true) : undefined;
    return await db.select().from(schema.blogPosts)
      .where(conditions)
      .orderBy(desc(schema.blogPosts.createdAt));
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const results = await db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.id, id));
    return results[0] || null;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const results = await db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, slug));
    return results[0] || null;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const results = await db.insert(schema.blogPosts)
      .values({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | null> {
    const results = await db.update(schema.blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return results[0] || null;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const results = await db.delete(schema.blogPosts)
      .where(eq(schema.blogPosts.id, id));
    return results.rowCount > 0;
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db.update(schema.blogPosts)
      .set({ viewCount: sql`${schema.blogPosts.viewCount} + 1` })
      .where(eq(schema.blogPosts.id, id));
  }

  // Testimonials
  async getTestimonials(activeOnly = true): Promise<Testimonial[]> {
    const conditions = activeOnly ? eq(schema.testimonials.isActive, true) : undefined;
    return await db.select().from(schema.testimonials)
      .where(conditions)
      .orderBy(schema.testimonials.sortOrder, schema.testimonials.createdAt);
  }

  async getTestimonialById(id: string): Promise<Testimonial | null> {
    const results = await db.select().from(schema.testimonials)
      .where(eq(schema.testimonials.id, id));
    return results[0] || null;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const results = await db.insert(schema.testimonials)
      .values({
        ...testimonial,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | null> {
    const results = await db.update(schema.testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, id))
      .returning();
    return results[0] || null;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const results = await db.delete(schema.testimonials)
      .where(eq(schema.testimonials.id, id));
    return results.rowCount > 0;
  }

  // Workshops
  async getWorkshops(activeOnly = true): Promise<Workshop[]> {
    const conditions = activeOnly ? eq(schema.workshops.isActive, true) : undefined;
    return await db.select().from(schema.workshops)
      .where(conditions)
      .orderBy(schema.workshops.workshopDate);
  }

  async getWorkshopById(id: string): Promise<Workshop | null> {
    const results = await db.select().from(schema.workshops)
      .where(eq(schema.workshops.id, id));
    return results[0] || null;
  }

  async getUpcomingWorkshops(): Promise<Workshop[]> {
    return await db.select().from(schema.workshops)
      .where(and(
        eq(schema.workshops.isActive, true),
        sql`${schema.workshops.workshopDate} > NOW()`
      ))
      .orderBy(schema.workshops.workshopDate);
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const results = await db.insert(schema.workshops)
      .values({
        ...workshop,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateWorkshop(id: string, workshop: Partial<InsertWorkshop>): Promise<Workshop | null> {
    const results = await db.update(schema.workshops)
      .set({ ...workshop, updatedAt: new Date() })
      .where(eq(schema.workshops.id, id))
      .returning();
    return results[0] || null;
  }

  async deleteWorkshop(id: string): Promise<boolean> {
    const results = await db.delete(schema.workshops)
      .where(eq(schema.workshops.id, id));
    return results.rowCount > 0;
  }

  // Workshop Bookings
  async getWorkshopBookings(): Promise<WorkshopBooking[]> {
    return await db.select().from(schema.workshopBookings)
      .orderBy(desc(schema.workshopBookings.createdAt));
  }

  async getWorkshopBookingById(id: string): Promise<WorkshopBooking | null> {
    const results = await db.select().from(schema.workshopBookings)
      .where(eq(schema.workshopBookings.id, id));
    return results[0] || null;
  }

  async getWorkshopBookingsByWorkshop(workshopId: string): Promise<WorkshopBooking[]> {
    return await db.select().from(schema.workshopBookings)
      .where(eq(schema.workshopBookings.workshopId, workshopId))
      .orderBy(desc(schema.workshopBookings.createdAt));
  }

  async createWorkshopBooking(booking: InsertWorkshopBooking): Promise<WorkshopBooking> {
    const results = await db.insert(schema.workshopBookings)
      .values({
        ...booking,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateWorkshopBooking(id: string, booking: Partial<InsertWorkshopBooking>): Promise<WorkshopBooking | null> {
    const results = await db.update(schema.workshopBookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(schema.workshopBookings.id, id))
      .returning();
    return results[0] || null;
  }

  async updateWorkshopBookingPayment(id: string, paymentStatus: string, paymentId: string): Promise<WorkshopBooking | null> {
    const results = await db.update(schema.workshopBookings)
      .set({ 
        paymentStatus, 
        paymentId,
        updatedAt: new Date() 
      })
      .where(eq(schema.workshopBookings.id, id))
      .returning();
    return results[0] || null;
  }

  // Package Inquiries
  async getPackageInquiries(): Promise<PackageInquiry[]> {
    return await db.select().from(schema.packageInquiries)
      .orderBy(desc(schema.packageInquiries.createdAt));
  }

  async getPackageInquiryById(id: string): Promise<PackageInquiry | null> {
    const results = await db.select().from(schema.packageInquiries)
      .where(eq(schema.packageInquiries.id, id));
    return results[0] || null;
  }

  async createPackageInquiry(inquiry: InsertPackageInquiry): Promise<PackageInquiry> {
    const results = await db.insert(schema.packageInquiries)
      .values({
        ...inquiry,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updatePackageInquiry(id: string, inquiry: Partial<InsertPackageInquiry>): Promise<PackageInquiry | null> {
    const results = await db.update(schema.packageInquiries)
      .set({ ...inquiry, updatedAt: new Date() })
      .where(eq(schema.packageInquiries.id, id))
      .returning();
    return results[0] || null;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt));
  }

  async getContactMessageById(id: string): Promise<ContactMessage | null> {
    const results = await db.select().from(schema.contactMessages)
      .where(eq(schema.contactMessages.id, id));
    return results[0] || null;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const results = await db.insert(schema.contactMessages)
      .values({
        ...message,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateContactMessage(id: string, message: Partial<InsertContactMessage>): Promise<ContactMessage | null> {
    const results = await db.update(schema.contactMessages)
      .set({ ...message, updatedAt: new Date() })
      .where(eq(schema.contactMessages.id, id))
      .returning();
    return results[0] || null;
  }

  // Admin Users
  async getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    const results = await db.select().from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email));
    return results[0] || null;
  }

  async getAdminUserById(id: string): Promise<AdminUser | null> {
    const results = await db.select().from(schema.adminUsers)
      .where(eq(schema.adminUsers.id, id));
    return results[0] || null;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const results = await db.insert(schema.adminUsers)
      .values({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser | null> {
    const results = await db.update(schema.adminUsers)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(schema.adminUsers.id, id))
      .returning();
    return results[0] || null;
  }

  // Payment Orders
  async getPaymentOrders(): Promise<PaymentOrder[]> {
    return await db.select().from(schema.paymentOrders)
      .orderBy(desc(schema.paymentOrders.createdAt));
  }

  async createPaymentOrder(order: InsertPaymentOrder): Promise<PaymentOrder> {
    const results = await db.insert(schema.paymentOrders)
      .values({
        ...order,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return results[0];
  }

  async getPaymentOrderByRazorpayId(razorpayOrderId: string): Promise<PaymentOrder | null> {
    const results = await db.select().from(schema.paymentOrders)
      .where(eq(schema.paymentOrders.razorpayOrderId, razorpayOrderId));
    return results[0] || null;
  }

  async updatePaymentOrderStatus(id: string, status: string, paymentId?: string): Promise<PaymentOrder | null> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    const results = await db.update(schema.paymentOrders)
      .set(updateData)
      .where(eq(schema.paymentOrders.id, id))
      .returning();
    return results[0] || null;
  }
}

// Create storage instance
export const storage = new DbStorage();
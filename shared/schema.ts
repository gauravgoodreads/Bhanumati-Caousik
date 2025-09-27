import { pgTable, text, integer, timestamp, boolean, jsonb, uuid, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Services Table
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // Lucide icon name
  color: text('color').notNull().default('blue'), // Theme color
  features: text('features').array().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Packages Table
export const packages = pgTable('packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: text('duration').notNull(), // e.g., "3 months", "6 sessions"
  features: text('features').array().notNull().default([]),
  isPopular: boolean('is_popular').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  category: text('category').notNull(), // e.g., "individual", "corporate"
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  tags: text('tags').array().notNull().default([]),
  category: text('category').notNull(),
  isPublished: boolean('is_published').notNull().default(false),
  readTime: integer('read_time').notNull().default(5), // minutes
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Testimonials Table
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  company: text('company'),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Workshops Table
export const workshops = pgTable('workshops', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content'), // Detailed content/agenda
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(), // hours
  maxParticipants: integer('max_participants').notNull(),
  currentParticipants: integer('current_participants').notNull().default(0),
  workshopDate: timestamp('workshop_date').notNull(),
  registrationDeadline: timestamp('registration_deadline').notNull(),
  location: text('location'), // "Online" or physical address
  meetingLink: text('meeting_link'), // For online workshops
  isActive: boolean('is_active').notNull().default(true),
  category: text('category').notNull(),
  prerequisites: text('prerequisites').array().notNull().default([]),
  learningOutcomes: text('learning_outcomes').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Workshop Bookings Table
export const workshopBookings = pgTable('workshop_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  workshopId: uuid('workshop_id').notNull().references(() => workshops.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'), // pending, completed, failed, refunded
  paymentId: text('payment_id'), // Razorpay payment ID
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Package Inquiries Table
export const packageInquiries = pgTable('package_inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  packageId: uuid('package_id').notNull().references(() => packages.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  message: text('message'),
  status: text('status').notNull().default('new'), // new, contacted, converted, closed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // new, read, replied, closed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // hashed
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'), // admin, super_admin
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Insert Schemas
export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertWorkshopSchema = createInsertSchema(workshops).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentParticipants: true
});

export const insertWorkshopBookingSchema = createInsertSchema(workshopBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  paymentStatus: true,
  paymentId: true
});

export const insertPackageInquirySchema = createInsertSchema(packageInquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});

// Types
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Workshop = typeof workshops.$inferSelect;
export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;

export type WorkshopBooking = typeof workshopBookings.$inferSelect;
export type InsertWorkshopBooking = z.infer<typeof insertWorkshopBookingSchema>;

export type PackageInquiry = typeof packageInquiries.$inferSelect;
export type InsertPackageInquiry = z.infer<typeof insertPackageInquirySchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
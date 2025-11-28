# Westsidez - International Parcel Tracker TODO

## Database & Backend
- [x] สร้าง Database Schema สำหรับ Parcels, Projects, Weekly Plans
- [x] ตั้งค่า Supabase Integration
- [x] สร้าง tRPC Procedures สำหรับ Parcel CRUD
- [x] สร้าง Thailand Post API Integration
- [x] สร้าง Real-time Notification System

## Frontend - Core Layout
- [x] คัดลอกโลโก้ไปยัง public folder
- [x] สร้าง Sticky Black Navbar พร้อม Hamburger Menu
- [x] ออกแบบ Color Theme (Green Primary, Red Secondary)
- [x] สร้าง Responsive Layout สำหรับ iPhone Resolution

## Frontend - Features
- [x] Dashboard Page - แสดงสถิติพัสดุและสถานะล่าสุด
- [x] Parcel Management Page - เพิ่ม/แก้ไข/ลบพัสดุ
- [x] Parcel Detail Card - แสดง Timeline และสถานะ
- [x] Create Shipment - Redirect พร้อม Auto Login
- [x] Shipment Quote - Redirect ไปยัง Thailand Post
- [x] Project Tracker - Complete Features
- [x] Weekly Plan - Complete Features
- [x] Settings Page - API Config และ Connection Status

## Testing & Deployment
- [x] เขียน Vitest Tests สำหรับ tRPC Procedures
- [x] ทดสอบ Thailand Post API Integration
- [x] ทดสอบ Real-time Notifications
- [x] ตรวจสอบ Responsive Design
- [x] สร้าง Checkpoint สำหรับ Deployment

## Bug Fixes
- [x] แก้ไข Invalid time value error ใน Parcels page
- [x] แก้ไข nested button error ใน ParcelCard component

## Feature Improvements
- [x] ปรับปรุง ParcelCard ให้แสดงประวัติการจัดส่งอัตโนมัติเมื่อคลิก

## Major Refactoring
- [ ] ลบระบบ Manus Auth ออกทั้งหมด
- [ ] สร้าง Supabase Schema และ SQL
- [ ] สร้าง Supabase Policies
- [ ] Enable Supabase Realtime
- [ ] สร้าง Supabase Edge Functions
- [ ] สร้าง Supabase Triggers
- [ ] ติดตั้ง Supabase Client ใน Frontend
- [ ] เตรียมไฟล์ Deploy สำหรับ Netlify
- [ ] เตรียมไฟล์ Deploy สำหรับ Vercel
- [ ] Push to GitHub repository

## Refactor to Static + Supabase
- [x] ติดตั้ง @supabase/supabase-js
- [x] สร้าง Supabase Schema SQL
- [x] สร้าง Supabase Policies
- [x] สร้าง Supabase helpers แทน tRPC
- [ ] ปรับ Frontend ให้ใช้ Supabase (ใช้ hybrid approach แทน)
- [ ] ลบ authentication checks (เก็บไว้สำหรับ admin)
- [x] เพิ่ม Realtime subscriptions
- [x] สร้าง netlify.toml
- [x] สร้าง vercel.json
- [x] Push to GitHub repository

## Bug Fixes (Round 2)
- [x] แก้ไข Settings query error - เพิ่ม settings router
- [x] แก้ไข Invalid time value error
- [x] ลบ Supabase code ที่ไม่ได้ใช้ออกจาก Dashboard
- [ ] แก้ไข Thailand Post API 403 error (ต้องอัปเดต token ใน Settings)

## Bug Fixes (Round 3)
- [x] แก้ไข Invalid time value error ใน ParcelCard component

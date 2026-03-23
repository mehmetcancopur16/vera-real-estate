import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import logger from '../utils/logger.js';
import User from '../models/User.model.js';
import Property from '../models/Property.model.js';

const imagePool = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop'
];

const seedProperties = [
  {
    title: 'Meram Baglari Manzarali 3+1 Daire',
    description: 'Konya Meram bolgesinde genis balkonlu, aile yasamina uygun satilik daire.',
    type: 'apartment',
    listingType: 'sale',
    price: 4650000,
    size: 165,
    features: { rooms: 3, bathrooms: 2, floor: 6, heating: 'Kombi' },
    location: { city: 'Konya', district: 'Meram', address: 'Aydinlik Evler Mh. 125. Sk.' },
    viewCount: 74
  },
  {
    title: 'Selcuklu Tramvay Hattina Yakin 2+1',
    description: 'Universiteye ve tramvaya yuruye mesafede kiralik modern daire.',
    type: 'apartment',
    listingType: 'rent',
    price: 22000,
    size: 105,
    features: { rooms: 2, bathrooms: 1, floor: 3, heating: 'Merkezi' },
    location: { city: 'Konya', district: 'Selcuklu', address: 'Yazir Mh. Kule Cd.' },
    viewCount: 58
  },
  {
    title: 'Karatayda Yatirimlik Ticari Dukkan',
    description: 'Yaya trafiginin yuksek oldugu noktada, uzun donem kiracili ticari dukkan.',
    type: 'commercial',
    listingType: 'sale',
    price: 7900000,
    size: 210,
    features: { rooms: 4, bathrooms: 1, floor: 0, heating: 'Klima' },
    location: { city: 'Konya', district: 'Karatay', address: 'Aziziye Mh. Sehitler Cd.' },
    viewCount: 41
  },
  {
    title: 'Basaksehirde Akilli Ev Sistemli 4+1',
    description: 'Istanbul Basaksehir bolgesinde site icinde, kapali otoparkli luks daire.',
    type: 'apartment',
    listingType: 'sale',
    price: 12400000,
    size: 220,
    features: { rooms: 4, bathrooms: 2, floor: 8, heating: 'Merkezi' },
    location: { city: 'Istanbul', district: 'Basaksehir', address: 'Kayasehir Bulvari No:24' },
    viewCount: 126
  },
  {
    title: 'Kadikoyde Deniz Manzarali Kiralik 1+1',
    description: 'Moda sahiline yakin, yeni tadilatli ve esyali kiralik daire.',
    type: 'apartment',
    listingType: 'rent',
    price: 39000,
    size: 75,
    features: { rooms: 1, bathrooms: 1, floor: 5, heating: 'Kombi' },
    location: { city: 'Istanbul', district: 'Kadikoy', address: 'Caferaga Mh. Moda Cd.' },
    viewCount: 89
  },
  {
    title: 'Sariyerde Mustakil Bahceli Villa',
    description: 'Bogaz hattina yakin, ozel havuzlu ve genis yasam alanli prestij villa.',
    type: 'house',
    listingType: 'sale',
    price: 38500000,
    size: 480,
    features: { rooms: 6, bathrooms: 4, floor: 3, heating: 'Yerden Isitma' },
    location: { city: 'Istanbul', district: 'Sariyer', address: 'Rumeli Hisari Yolu No:18' },
    viewCount: 162
  },
  {
    title: 'Konya Organize Yakin Lojistik Arsa',
    description: 'Depolama ve sanayi yatirimlari icin uygun, ulasim avantaji yuksek arsa.',
    type: 'land',
    listingType: 'sale',
    price: 11300000,
    size: 1850,
    features: { rooms: 0, bathrooms: 0, floor: 0, heating: 'Yok' },
    location: { city: 'Konya', district: 'Selcuklu', address: 'OSB 4. Kisim Kavsagi' },
    viewCount: 36
  },
  {
    title: 'Besiktas Leventte A+ Plaza Ofisi',
    description: 'Kurumsal firmalara uygun, otoparkli ve guvenlikli premium ofis kati.',
    type: 'commercial',
    listingType: 'rent',
    price: 145000,
    size: 320,
    features: { rooms: 7, bathrooms: 2, floor: 12, heating: 'VRF' },
    location: { city: 'Istanbul', district: 'Besiktas', address: 'Levent Buyukdere Cd. No:88' },
    viewCount: 97
  }
];

async function seed() {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), Property.deleteMany({})]);
    logger.info('Mevcut User ve Property verileri temizlendi');

    const hashedPassword = await bcrypt.hash('123456', 12);
    const admin = await User.create({
      name: 'Vera Admin',
      email: 'admin@vera.com',
      password: hashedPassword,
      role: 'admin'
    });

    const payload = seedProperties.map((item, idx) => ({
      ...item,
      owner: admin._id,
      currency: 'TRY',
      isActive: true,
      images: [imagePool[idx % imagePool.length], imagePool[(idx + 1) % imagePool.length]]
    }));

    await Property.insertMany(payload);
    logger.info(`Seed tamamlandi: 1 admin + ${payload.length} ilan olusturuldu`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Seed hatasi: ${error.message}`, { stack: error.stack });
    try {
      await mongoose.connection.close();
    } catch {
      // ignore close errors
    }
    process.exit(1);
  }
}

seed();

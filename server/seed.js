require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Course = require('./models/Course');
const User = require('./models/User');

const users = [
    { email: "admin@co.com", password: "admin123", type: "admin" },
];

const courses = [
    {
        title: 'Intro to JavaScript',
        description: 'Variables, functions, and control flow.',
        instructor: 'Ada Lovelace',
        published: true,
    },
    {
        title: 'React Fundamentals',
        description: 'Components, props, state, and hooks.',
        instructor: 'Grace Hopper',
        published: true,
    },
    {
        title: 'MongoDB Basics',
        description: 'Documents, collections, and queries.',
        instructor: 'Edsger Dijkstra',
        published: false,
    },
];

const seed = async () => {
    try {
        await connectDB();
        
        // Clear existing collections so re-running is idempotent
        await User.deleteMany({}); 
        console.log('Deleted User collection');
        const usersCreated = await User.create(users);
        console.log(`Seeded ${usersCreated.length} users`);
        
        await Course.deleteMany({});
        console.log('Deleted Course collection');
        const coursesCreated = await Course.insertMany(courses);
        console.log(`Seeded ${coursesCreated.length} courses.`);
    } catch (err) {
        console.log('Seed failed:', err.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seed();
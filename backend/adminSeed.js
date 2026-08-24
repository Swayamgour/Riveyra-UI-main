const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';
        const adminPassword = 'password';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("🔥 Admin user already exists. Email: admin@example.com, Password: password");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword
        });

        console.log("🔥 Admin user created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: password");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();

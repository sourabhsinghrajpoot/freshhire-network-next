import bcrypt from 'bcryptjs';
const password=process.argv[2];if(!password){console.error('Usage: pnpm create-admin "your-new-password"');process.exit(1)}bcrypt.hash(password,12).then(hash=>console.log(`ADMIN_PASSWORD_HASH=${hash}`));

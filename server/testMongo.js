const mongoose = require('mongoose');

// Grab URI from command line argument or from .env
require('dotenv').config();
const uri = process.argv[2] || process.env.MONGO_URI;

console.log('\n--- MongoDB Connection Diagnostic Tool ---\n');

if (!uri) {
  console.error('❌ Error: No MongoDB URI provided.');
  console.log('Usage: node testMongo.js "your_mongodb_connection_string"\n');
  process.exit(1);
}

// 1. Check for literal <password> brackets
if (uri.includes('<') || uri.includes('>')) {
  console.error('❌ Problem Found: Your URI still contains "<" or ">" brackets.');
  console.error('   Example: mongodb+srv://admin:<password>@...');
  console.error('   Fix: Remove the brackets and write only the password (e.g. :mypassword@).\n');
}

// 2. Check for quotes around the URI
if (uri.startsWith('"') || uri.startsWith("'")) {
  console.error('❌ Problem Found: Your URI has quotes around it.');
  console.error('   Fix: In Render / .env, enter the URI without any surrounding quotes.\n');
}

// 3. Check for multiple '@' symbols (special characters in password or email as username)
const atCount = (uri.match(/@/g) || []).length;
if (atCount > 1) {
  console.error('❌ Problem Found: Your URI contains more than one "@" symbol (' + atCount + ' found).');
  console.error('   This usually happens when:');
  console.error('   - Your password contains an "@" sign (e.g., pass@123)');
  console.error('   - Your username is an email address (e.g., user@gmail.com)');
  console.error('   Fix: Create a simple username (e.g. appuser) and password with only letters and numbers!\n');
}

// Mask password for display
const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log('Attempting connection to:', maskedUri);

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then((conn) => {
    console.log('\n✅ SUCCESS! Connected to MongoDB host:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
    console.log('\nYour connection string is 100% valid and working!\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Connection Failed with error:');
    console.error(err.message);

    if (err.message.includes('bad auth') || err.message.includes('authentication failed')) {
      console.log('\n💡 Exact Reason for "bad auth":');
      console.log('   MongoDB Atlas does not recognize this username or password.');
      console.log('   Steps to fix in 1 minute:');
      console.log('   1. Go to cloud.mongodb.com -> Database Access (left sidebar).');
      console.log('   2. Click "Add New Database User".');
      console.log('   3. Set Authentication Method to "Password".');
      console.log('   4. Username: appuser');
      console.log('   5. Password: MySecretPass2026 (Letters and numbers only, NO symbols!)');
      console.log('   6. Database User Privileges: Read and write to any database.');
      console.log('   7. Click "Add User", then update your URI with "appuser:MySecretPass2026".\n');
    }
    process.exit(1);
  });

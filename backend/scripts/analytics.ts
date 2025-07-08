import dotenv from 'dotenv';
import { connectDatabase } from '../src/utils/database';
import { User, Wine } from '../src/models';

// Load environment variables
dotenv.config();

const generateAnalytics = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await connectDatabase();
    
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testUser = await User.findOne({ email: testEmail });
    if (!testUser) {
      console.log(`❌ Test user not found: ${testEmail}`);
      process.exit(1);
    }
    
    console.log(`\n📊 Wine Collection Analytics for ${testUser.email}`);
    console.log('=' .repeat(50));
    
    // Total wines
    const totalWines = await Wine.countDocuments({ userId: testUser._id.toString() });
    console.log(`🍷 Total Wines: ${totalWines}`);
    
    // Wines by style
    const winesByStyle = await Wine.aggregate([
      { $match: { userId: testUser._id.toString() } },
      { $group: { _id: '$style', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🎨 Wines by Style:');
    winesByStyle.forEach(item => {
      console.log(`  ${item._id}: ${item.count} bottles`);
    });
    
    // Wines by country
    const winesByCountry = await Wine.aggregate([
      { $match: { userId: testUser._id.toString() } },
      { $group: { _id: '$region.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🌍 Wines by Country:');
    winesByCountry.forEach(item => {
      console.log(`  ${item._id}: ${item.count} bottles`);
    });
    
    // Vintage distribution
    const vintageDistribution = await Wine.aggregate([
      { $match: { userId: testUser._id.toString() } },
      { $group: { _id: '$vintage', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    console.log('\n📅 Vintage Distribution:');
    vintageDistribution.forEach(item => {
      console.log(`  ${item._id}: ${item.count} bottles`);
    });
    
    // Most expensive wines
    const expensiveWines = await Wine.find(
      { userId: testUser._id.toString(), 'cellar.purchasePrice': { $exists: true } }
    )
    .sort({ 'cellar.purchasePrice': -1 })
    .limit(5)
    .select('name producer vintage cellar.purchasePrice');
    
    console.log('\n💰 Most Expensive Wines:');
    expensiveWines.forEach((wine, index) => {
      console.log(`  ${index + 1}. ${wine.name} (${wine.vintage}) - $${wine.cellar?.purchasePrice}`);
    });
    
    // Highest rated wines
    const highestRated = await Wine.find(
      { userId: testUser._id.toString(), 'ratings.personal': { $exists: true } }
    )
    .sort({ 'ratings.personal': -1 })
    .limit(5)
    .select('name producer vintage ratings.personal');
    
    console.log('\n⭐ Highest Rated Wines (Personal):');
    highestRated.forEach((wine, index) => {
      console.log(`  ${index + 1}. ${wine.name} (${wine.vintage}) - ${wine.ratings?.personal}/100`);
    });
    
    // Collection value
    const collectionValue = await Wine.aggregate([
      { $match: { userId: testUser._id.toString(), 'cellar.purchasePrice': { $exists: true } } },
      { 
        $group: { 
          _id: null, 
          totalValue: { $sum: { $multiply: ['$cellar.quantity', '$cellar.purchasePrice'] } },
          totalBottles: { $sum: '$cellar.quantity' }
        } 
      }
    ]);
    
    if (collectionValue.length > 0) {
      console.log('\n💎 Collection Value:');
      console.log(`  Total Value: $${collectionValue[0].totalValue.toLocaleString()}`);
      console.log(`  Total Bottles: ${collectionValue[0].totalBottles}`);
      console.log(`  Average Price per Bottle: $${(collectionValue[0].totalValue / collectionValue[0].totalBottles).toFixed(2)}`);
    }
    
    console.log('\n✅ Analytics complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error generating analytics:', error);
    process.exit(1);
  }
};

// Run the analytics script
generateAnalytics();

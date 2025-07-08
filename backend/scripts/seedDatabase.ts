import dotenv from 'dotenv';
import { connectDatabase } from '../src/utils/database';
import { User, Wine } from '../src/models';

// Load environment variables
dotenv.config();

// Sample wine data for seeding
const wineData = [
  // French Wines
  {
    name: 'Château Margaux',
    producer: 'Château Margaux',
    region: { country: 'France', area: 'Bordeaux', subregion: 'Margaux' },
    grapes: ['Cabernet Sauvignon', 'Merlot', 'Petit Verdot', 'Cabernet Franc'],
    style: 'red' as const,
    alcohol: 13.5,
    tastingNotes: {
      aroma: ['blackcurrant', 'cedar', 'violet', 'tobacco'],
      taste: ['full-bodied', 'elegant tannins', 'dark fruit', 'spice'],
      finish: 'Long and sophisticated'
    },
    ratings: { personal: 95, critic: { score: 98, reviewer: 'Robert Parker' } }
  },
  {
    name: 'Dom Pérignon',
    producer: 'Moët & Chandon',
    region: { country: 'France', area: 'Champagne' },
    grapes: ['Chardonnay', 'Pinot Noir'],
    style: 'sparkling' as const,
    alcohol: 12.5,
    tastingNotes: {
      aroma: ['brioche', 'citrus', 'white flowers'],
      taste: ['crisp', 'elegant bubbles', 'mineral'],
      finish: 'Clean and refreshing'
    },
    ratings: { personal: 92, critic: { score: 95, reviewer: 'Wine Spectator' } }
  },
  {
    name: 'Chablis Premier Cru',
    producer: 'William Fèvre',
    region: { country: 'France', area: 'Burgundy', subregion: 'Chablis' },
    grapes: ['Chardonnay'],
    style: 'white' as const,
    alcohol: 12.8,
    tastingNotes: {
      aroma: ['green apple', 'mineral', 'citrus'],
      taste: ['crisp acidity', 'stone fruit', 'oyster shell'],
      finish: 'Mineral and persistent'
    },
    ratings: { personal: 88 }
  },
  
  // Italian Wines
  {
    name: 'Barolo Brunate',
    producer: 'Giuseppe Rinaldi',
    region: { country: 'Italy', area: 'Piedmont', subregion: 'Barolo' },
    grapes: ['Nebbiolo'],
    style: 'red' as const,
    alcohol: 14.0,
    tastingNotes: {
      aroma: ['rose', 'tar', 'cherry', 'herbs'],
      taste: ['powerful tannins', 'red fruit', 'earthy'],
      finish: 'Long and complex'
    },
    ratings: { personal: 90, critic: { score: 93, reviewer: 'Antonio Galloni' } }
  },
  {
    name: 'Chianti Classico Riserva',
    producer: 'Castello di Ama',
    region: { country: 'Italy', area: 'Tuscany', subregion: 'Chianti Classico' },
    grapes: ['Sangiovese', 'Canaiolo'],
    style: 'red' as const,
    alcohol: 13.5,
    tastingNotes: {
      aroma: ['cherry', 'leather', 'herb'],
      taste: ['medium-bodied', 'bright acidity', 'savory'],
      finish: 'Food-friendly and persistent'
    },
    ratings: { personal: 85 }
  },
  
  // Spanish Wines
  {
    name: 'Rioja Gran Reserva',
    producer: 'Marqués de Riscal',
    region: { country: 'Spain', area: 'Rioja' },
    grapes: ['Tempranillo', 'Graciano', 'Mazuelo'],
    style: 'red' as const,
    alcohol: 13.8,
    tastingNotes: {
      aroma: ['vanilla', 'coconut', 'red fruit'],
      taste: ['smooth tannins', 'oak influence', 'spice'],
      finish: 'Balanced and mature'
    },
    ratings: { personal: 87 }
  },
  
  // German Wines
  {
    name: 'Riesling Spätlese',
    producer: 'Dr. Loosen',
    region: { country: 'Germany', area: 'Mosel' },
    grapes: ['Riesling'],
    style: 'white' as const,
    alcohol: 8.5,
    tastingNotes: {
      aroma: ['peach', 'apricot', 'honey'],
      taste: ['off-dry', 'bright acidity', 'stone fruit'],
      finish: 'Sweet and refreshing'
    },
    ratings: { personal: 89 }
  },
  
  // California Wines
  {
    name: 'Cabernet Sauvignon',
    producer: 'Opus One',
    region: { country: 'USA', area: 'California', subregion: 'Napa Valley' },
    grapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'],
    style: 'red' as const,
    alcohol: 14.5,
    tastingNotes: {
      aroma: ['blackberry', 'cassis', 'cedar'],
      taste: ['full-bodied', 'velvety tannins', 'dark fruit'],
      finish: 'Rich and long'
    },
    ratings: { personal: 94, critic: { score: 96, reviewer: 'James Suckling' } }
  },
  {
    name: 'Pinot Noir',
    producer: 'Domaine de la Côte',
    region: { country: 'USA', area: 'California', subregion: 'Santa Barbara County' },
    grapes: ['Pinot Noir'],
    style: 'red' as const,
    alcohol: 13.2,
    tastingNotes: {
      aroma: ['strawberry', 'rose petal', 'earth'],
      taste: ['light-bodied', 'silky texture', 'red fruit'],
      finish: 'Elegant and pure'
    },
    ratings: { personal: 91 }
  },
  
  // Australian Wines
  {
    name: 'Shiraz',
    producer: 'Penfolds',
    region: { country: 'Australia', area: 'Barossa Valley' },
    grapes: ['Shiraz'],
    style: 'red' as const,
    alcohol: 14.8,
    tastingNotes: {
      aroma: ['blackberry', 'pepper', 'chocolate'],
      taste: ['full-bodied', 'rich texture', 'spice'],
      finish: 'Bold and warming'
    },
    ratings: { personal: 88 }
  }
];

// Additional wine variations to reach 100 wines
const wineVariations = [
  { vintage: 2015, cellar: { quantity: 2, location: { room: 'Main Cellar', rack: 'A1', shelf: '3', position: '12' }, purchasePrice: 450, purchaseDate: '2018-01-15', drinkBy: '2030-12-31' } },
  { vintage: 2016, cellar: { quantity: 1, location: { room: 'Main Cellar', rack: 'A2', shelf: '1', position: '5' }, purchasePrice: 480, purchaseDate: '2019-03-20', drinkBy: '2031-12-31' } },
  { vintage: 2017, cellar: { quantity: 3, location: { room: 'Climate Room', rack: 'B1', shelf: '2', position: '8-10' }, purchasePrice: 420, purchaseDate: '2020-05-10', drinkBy: '2032-12-31' } },
  { vintage: 2018, cellar: { quantity: 1, location: { room: 'Main Cellar', rack: 'C3', shelf: '4', position: '15', notes: 'Special reserve section' }, purchasePrice: 500, purchaseDate: '2021-08-25', drinkBy: '2033-12-31' } },
  { vintage: 2019, cellar: { quantity: 2, location: { room: 'Basement', rack: 'D1', shelf: '1', position: '3-4' }, purchasePrice: 390, purchaseDate: '2022-02-14', drinkBy: '2034-12-31' } },
  { vintage: 2020, cellar: { quantity: 1, location: { room: 'Climate Room', rack: 'B2', shelf: '3', position: '7' }, purchasePrice: 520, purchaseDate: '2023-01-05', drinkBy: '2035-12-31' } },
  { vintage: 2021, cellar: { quantity: 4, location: { room: 'Main Cellar', rack: 'A3', shelf: '2', position: '20-23' }, purchasePrice: 350, purchaseDate: '2023-06-30', drinkBy: '2036-12-31' } },
  { vintage: 2022, cellar: { quantity: 2, location: { room: 'Basement', rack: 'D2', shelf: '4', position: '11-12' }, purchasePrice: 380, purchaseDate: '2024-01-15', drinkBy: '2037-12-31' } },
  { vintage: 2023, cellar: { quantity: 1, location: { room: 'Climate Room', rack: 'B3', shelf: '1', position: '2', notes: 'Easy access for young wines' }, purchasePrice: 400, purchaseDate: '2024-12-01', drinkBy: '2038-12-31' } },
  { vintage: 2013, cellar: { quantity: 1, location: { room: 'Main Cellar', rack: 'C1', shelf: '5', position: '25', notes: 'Premium aged section' }, purchasePrice: 600, purchaseDate: '2017-11-20', drinkBy: '2028-12-31' } }
];

const generateWineCollection = (): any[] => {
  const wines: any[] = [];
  let wineIndex = 0;
  
  // Generate 100 wines by cycling through base wines with different vintages
  for (let i = 0; i < 100; i++) {
    const baseWine = wineData[wineIndex % wineData.length];
    const variation = wineVariations[i % wineVariations.length];
    
    const wine: any = {
      ...baseWine,
      vintage: variation.vintage,
      cellar: {
        ...variation.cellar,
        purchaseDate: new Date(variation.cellar.purchaseDate),
        drinkBy: variation.cellar.drinkBy ? new Date(variation.cellar.drinkBy) : undefined
      }
    };
    
    // Add some variety to names for duplicates
    if (i >= wineData.length) {
      const cycle = Math.floor(i / wineData.length);
      wine.name = `${baseWine.name} (Bottle ${cycle + 1})`;
    }
    
    wines.push(wine);
    wineIndex++;
  }
  
  return wines;
};

const seedDatabase = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await connectDatabase();
    
    console.log('👤 Creating test user...');
    
    // Get test user credentials from environment or use defaults
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_PASSWORD || 'defaultpassword';
    
    // Check if test user already exists
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      testUser = new User({
        email: testEmail,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User'
      });
      await testUser.save();
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️ Test user already exists');
    }
    
    // Clear existing wines for test user
    const deletedCount = await Wine.deleteMany({ userId: testUser._id.toString() });
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing wines for test user`);
    
    console.log('🍷 Generating wine collection...');
    const wines = generateWineCollection();
    
    // Add userId to each wine
    const winesWithUserId = wines.map(wine => ({
      ...wine,
      userId: testUser!._id.toString()
    }));
    
    console.log('💾 Inserting wines into database...');
    await Wine.insertMany(winesWithUserId);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${wines.length} wines for user: ${testUser.email}`);
    
    // Display some statistics
    const winesByStyle = await Wine.aggregate([
      { $match: { userId: testUser._id.toString() } },
      { $group: { _id: '$style', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const winesByCountry = await Wine.aggregate([
      { $match: { userId: testUser._id.toString() } },
      { $group: { _id: '$region.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Wine Collection Statistics:');
    console.log('By Style:', winesByStyle);
    console.log('By Country:', winesByCountry);
    
    console.log('\n🔐 Login credentials for testing:');
    console.log(`Email: ${testEmail}`);
    console.log('Password: [configured in environment]');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();

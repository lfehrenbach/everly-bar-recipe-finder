// scripts/uploadRecipes.js
import { createClient } from '@supabase/supabase-js'

// ✅ Connect to your Supabase project
const supabase = createClient(
  'https://xmvabbiefgecrewshvzj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdmFiYmllZmdlY3Jld3NodnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTEwMzAsImV4cCI6MjA2MTEyNzAzMH0.SmGUY25ngFjahczuxvMUyUvyYzyFrNDmoPiAQTquGGs'
)
// 🍸 Cocktails to upload
const cocktails = [
    {
      name: "Drops of Juniper",
      ingredients: [
        "1.5 oz St George Terroir Gin",
        "0.5 oz Elderflower",
        "0.75 oz Grapefruit Juice",
        "0.75 oz Blackberry Syrup",
        "0.75 oz Aquafaba"
      ],
      method: "Shake HARD + Double Strain in Coup Glass",
      garnish: "Grapefruit Wedge",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["gin", "liqueur"]
    },
    {
      name: "Wicked Behavior",
      ingredients: [
        "1.5 oz Four Roses (2 oz Premix)",
        "0.25 oz Aperol",
        "0.25 oz Elderflower",
        "1 oz Pineapple Juice",
        "0.25 oz Lemon Juice"
      ],
      method: "Stir + Double Strain over ice ball in Tub glass",
      garnish: "Lemon Peel",
      sweetness: "balanced",
      liquorForward: true,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["whiskey", "liqueur"]
    },
    {
      name: "Smoke on the Horizon",
      ingredients: [
        "1 oz Xicaru Mezcal",
        "0.5 oz Amaro",
        "0.5 oz Aperol",
        "0.75 oz Lime Juice"
      ],
      method: "Shake + Single Strain over Ice in Rocks Glass",
      garnish: "Lime Wedge",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["mezcal", "liqueur"]
    },
    {
      name: "Hola From the Other Side",
      ingredients: [
        "2 oz Hola Batch",
        "0.75 oz Lime Juice",
        "1 oz Hibiscus Agave Syrup"
      ],
      method: "Shake + Single Strain over Ice into Tub Glass",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["tequila", "liqueur"]
    },
    {
      name: "About Bloody Thyme",
      ingredients: [
        "1 oz Stateline Gin",
        "1 oz Blood Orange Liqueur",
        "0.5 oz Thyme Syrup",
        "0.5 oz Lemon Juice",
        "3 Dashes Jamaican No. 2 Bitters"
      ],
      method: "Shake + Strain over ice into Tub Glass",
      garnish: "Dried Orange Wheel + Thyme Sprig",
      sweetness: "balanced",
      liquorForward: true,
      allergens: [],
      seasons: ["fall"],
      liquorTypes: ["gin", "liqueur"]
    },
    {
      name: "The Bitter Sailor",
      ingredients: [
        "2 oz Plantaray Rum (3.25 oz Premix)",
        "1 oz Carpano Antica",
        "0.25 oz Maraschino Liqueur",
        "3 dashes Orange Bitters",
        "10 dashes Angostura Bitters"
      ],
      method: "Shake + Strain over ice in Tub Glass",
      garnish: "Lemon Peel",
      sweetness: "dry",
      liquorForward: true,
      allergens: [],
      seasons: ["fall"],
      liquorTypes: ["rum", "liqueur"]
    },
    {
      name: "Pink Cactus",
      ingredients: [
        "2 oz Corazon",
        "0.25 oz Campari",
        "0.75 oz Lime Juice",
        "0.5 oz Grapefruit Juice",
        "0.5 oz Cinnamon Syrup",
        "0.75 oz Aquafaba",
        "2 drops Saline"
      ],
      method: "Shake HARD + Strain over ice in Collins glass",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["tequila", "liqueur"]
    },
    {
      name: "Bubbles & Stuff",
      ingredients: [
        "1.5 oz Titos",
        "0.75 oz Strawberry Syrup",
        "0.5 oz Lemon Juice",
        "0.25 oz Mint Syrup",
        "Top with Prosecco"
      ],
      method: "Shake + Double Strain in Coup Glass",
      garnish: "Lemon Wheel + Top with Prosecco",
      sweetness: "sweet",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["vodka", "liqueur"]
    },
    {
      name: "Mint Condition",
      ingredients: [
        "1.5 oz St George Green Chile Vodka",
        "0.5 oz Mint Syrup",
        "0.5 oz Elderflower",
        "2 oz Prosecco",
        "Splash Soda Water"
      ],
      method: "Build in White Wine glass over ice",
      garnish: "Mint Sprig",
      sweetness: "balanced",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["vodka", "liqueur"]
    }
    // (there’s more cocktails coming — I'm splitting it for clean copy-paste!)
  ]
  cocktails.push(
    {
      name: "Aperol Spritz",
      ingredients: ["2 oz Aperol", "2 oz Prosecco", "Splash Seltzer"],
      method: "Build in Wine Glass, gently stir.",
      garnish: "Orange Slice",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["liqueur", "sparkling wine"]
    },
    {
      name: "Aviation",
      ingredients: ["1.5 oz Gin", "0.5 oz Luxardo", "0.5 oz Lemon", "0.25 oz Violette"],
      method: "Stir, Double Strain over a Cherry into Coup glass.",
      garnish: "Cherry",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["spring"],
      liquorTypes: ["gin", "liqueur"]
    },
    {
      name: "Boulevardier",
      ingredients: ["1 oz Whiskey", "1 oz Bruto Americano", "1.5 oz Carpano Antica"],
      method: "Stir, strain into Tub Glass over ice ball.",
      garnish: "Orange Twist",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["fall", "winter"],
      liquorTypes: ["whiskey", "liqueur"]
    },
    {
      name: "Cosmopolitan",
      ingredients: ["1.5 oz Citrus Vodka", "1 oz Cranberry", "0.5 oz Lime", "0.5 oz Triple Sec"],
      method: "Shake, Double Strain into Coup glass.",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["vodka", "liqueur"]
    },
    {
      name: "Dark and Stormy",
      ingredients: ["2 oz Myers’s Rum", "0.5 oz Lime", "Top with Ginger Beer"],
      method: "Build in Collins Glass over ice.",
      garnish: "Lime Wedge",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["rum"]
    },
    {
      name: "French 75",
      ingredients: ["1.5 oz Gin", "0.75 oz Lemon", "0.5 oz Simple", "Top with Prosecco"],
      method: "Shake, Double Strain into Flute, Top with Prosecco.",
      garnish: "Lemon Twist",
      sweetness: "balanced",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["gin", "sparkling wine"]
    },
    {
      name: "Gimlet",
      ingredients: ["2 oz Gin", "0.75 oz Lime", "0.5 oz Simple"],
      method: "Shake and strain into Coup Glass.",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["gin"]
    },
    {
      name: "Greyhound / Salty Dog",
      ingredients: ["1.5 oz Vodka", "Top with Grapefruit Juice"],
      method: "Build in Tub Glass over ice.",
      garnish: "Optional Salted Rim (for Salty Dog)",
      sweetness: "dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["vodka"]
    },
    {
      name: "Hot Toddy",
      ingredients: ["1.5 oz Whiskey or Brandy", "1 oz Honey", "0.5 oz Lemon", "Hot Water"],
      method: "Build in Coffee Mug, top with hot water, stir.",
      garnish: "Cinnamon Stick",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["winter"],
      liquorTypes: ["whiskey", "brandy"]
    },
    {
      name: "Long Island",
      ingredients: [
        "0.5 oz Vodka",
        "0.5 oz Gin",
        "0.5 oz Rum",
        "0.5 oz Tequila",
        "0.5 oz Triple Sec",
        "0.75 oz Lemon",
        "0.75 oz Simple",
        "Top with Coke"
      ],
      method: "Shake all spirits, pour into Tub Glass, top with Coke.",
      garnish: "Lemon Wedge",
      sweetness: "sweet",
      liquorForward: true,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["vodka", "gin", "rum", "tequila", "liqueur"]
    },
    {
      name: "Manhattan / Rob Roy",
      ingredients: ["2 oz Whiskey", "0.75 oz Carpano Antica", "2 dashes Angostura"],
      method: "Stir, Double Strain into Coup Glass.",
      garnish: "Cherry",
      sweetness: "dry",
      liquorForward: true,
      allergens: [],
      seasons: ["fall", "winter"],
      liquorTypes: ["whiskey"]
    },
    {
      name: "Margarita",
      ingredients: ["1.5 oz Tequila", "0.75 oz Triple Sec", "0.75 oz Lime", "Barspoon Agave"],
      method: "Shake, strain into Tub Glass.",
      garnish: "Optional Salted Rim + Lime Wedge",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["tequila", "liqueur"]
    },
    {
      name: "Martini",
      ingredients: ["2.5 oz Vodka or Gin", "0.25 oz Dry Vermouth (optional)", "Olive Juice (if Dirty)"],
      method: "Stir, Double Strain into Coup Glass.",
      garnish: "Olives or Lemon Twist",
      sweetness: "dry",
      liquorForward: true,
      allergens: [],
      seasons: ["year-round"],
      liquorTypes: ["vodka", "gin"]
    },
    {
      name: "Mojito",
      ingredients: ["1.5 oz Rum", "1 oz Mint Syrup", "Mint Leaves", "0.5 oz Lime", "Top with Seltzer"],
      method: "Muddle, Shake, Top with Seltzer in Collins Glass.",
      garnish: "Mint and Lime",
      sweetness: "sweet",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["rum"]
    },
    {
      name: "Moscow Mule",
      ingredients: ["2 oz Vodka", "0.5 oz Lime", "Top with Ginger Beer"],
      method: "Build in Copper Mug over ice.",
      garnish: "Lime Wedge",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["vodka"]
    },
    {
      name: "Negroni",
      ingredients: ["1 oz Campari", "1 oz Carpano Antica", "1 oz Gin"],
      method: "Stir, strain over ice ball into Tub Glass.",
      garnish: "Orange Twist",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["gin", "liqueur"]
    },
    {
      name: "Old Fashioned",
      ingredients: [
        "Cherry",
        "Orange Slice",
        "Barspoon Cherry Juice",
        "6 dashes Angostura",
        "1.5 oz Brandy or Whiskey"
      ],
      method: "Muddle fruit, add spirit, ice, Press.",
      garnish: "Cherry + Orange",
      sweetness: "balanced",
      liquorForward: true,
      allergens: [],
      seasons: ["fall", "winter"],
      liquorTypes: ["brandy", "whiskey"]
    },
    {
      name: "Sazerac",
      ingredients: ["1.5 oz Rye", "0.5 oz Simple", "2 dashes Trinity Bitters"],
      method: "Stir, Strain into Rocks Glass with Lemon Twist.",
      garnish: "Lemon Twist",
      sweetness: "dry",
      liquorForward: true,
      allergens: [],
      seasons: ["winter"],
      liquorTypes: ["whiskey"]
    },
    {
      name: "Tom Collins",
      ingredients: ["1.5 oz Gin", "1 oz Lemon", "0.5 oz Simple", "Top with Seltzer"],
      method: "Shake, Strain into Collins Glass, Top with Seltzer.",
      garnish: "Lemon Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["gin"]
    },
    {
      name: "Whiskey Sour",
      ingredients: ["1.5 oz Whiskey", "1 oz Lemon", "0.5 oz Simple"],
      method: "Shake, Strain into Rocks Glass.",
      garnish: "Lemon Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["year-round"],
      liquorTypes: ["whiskey"]
    },
    {
      name: "White Russian",
      ingredients: ["1.5 oz Vodka", "1 oz Creamer", "0.5 oz Simple", "Float 1 oz NOLA"],
      method: "Shake and pour into Tub Glass.",
      garnish: "None",
      sweetness: "sweet",
      liquorForward: false,
      allergens: ["dairy"],
      seasons: ["winter"],
      liquorTypes: ["vodka", "liqueur"]
    }
  )
  cocktails.push(
    {
      name: "Everly Irish Coffee",
      ingredients: [
        "1.5 oz Jameson",
        "Top with Hot Coffee",
        "Whipped Cream (shaken 2–3 oz heavy cream + 0.5 oz Simple Syrup)"
      ],
      method: "Build in Short Glass Mug, Top with Coffee, Float Whipped Cream.",
      garnish: "Whipped Cream",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: ["dairy"],
      seasons: ["winter"],
      liquorTypes: ["whiskey"]
    },
    {
      name: "Old Fashion Love Song",
      ingredients: [
        "Orange Slice",
        "Cocktail Cherry",
        "Barspoon Cherry Juice",
        "4 dashes Chipotle Cacao Bitters",
        "2 oz Four Roses",
        "0.5 oz Creme de Cacao"
      ],
      method: "Muddle fruit + bitters, Shake with spirits, Double Strain over Ice Ball.",
      garnish: "Skewered Cherry",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["fall", "winter"],
      liquorTypes: ["whiskey", "liqueur"]
    },
    {
      name: "Modern Hopper",
      ingredients: [
        "1 oz Creme de Cacao",
        "0.75 oz Creme de Menthe",
        "0.5 oz Lazzaroni Amaro",
        "1 oz Creamer"
      ],
      method: "Shake, Double Strain into Coup Glass.",
      garnish: "None",
      sweetness: "sweet",
      liquorForward: false,
      allergens: ["dairy"],
      seasons: ["winter"],
      liquorTypes: ["liqueur"]
    },
    {
      name: "Java Jive",
      ingredients: [
        "1 oz Vanilla Vodka",
        "0.75 oz Nola",
        "0.75 oz Almond Baileys",
        "0.5 oz Maple Syrup",
        "1.5 oz Cold Brew"
      ],
      method: "Shake, Strain over ice in Collins Glass.",
      garnish: "Shake of Cocoa Powder",
      sweetness: "sweet",
      liquorForward: false,
      allergens: ["dairy", "nuts"],
      seasons: ["winter"],
      liquorTypes: ["vodka", "liqueur"]
    },
    {
      name: "Espresso Martini",
      ingredients: [
        "1.5 oz Vanilla Vodka",
        "0.75 oz Nola",
        "0.75 oz Frangelico",
        "1 oz Espresso",
        "0.25 oz Simple Syrup"
      ],
      method: "Shake, Double Strain into Coup Glass.",
      garnish: "Coffee Bean",
      sweetness: "semi-dry",
      liquorForward: true,
      allergens: [],
      seasons: ["year-round"],
      liquorTypes: ["vodka", "liqueur"]
    },
    {
      name: "Lemon Drop",
      ingredients: [
        "2 oz Absolut Citron",
        "1 oz Lemon Juice",
        "1 oz Simple Syrup"
      ],
      method: "Shake, Double Strain into Coup Glass with Sugar Rim.",
      garnish: "Lemon Wheel",
      sweetness: "sweet",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["vodka"]
    },
    {
      name: "Bee’s Knees",
      ingredients: [
        "2 oz Stateline Gin",
        "0.75 oz Lemon Juice",
        "0.5 oz Honey Syrup"
      ],
      method: "Shake, Double Strain into Coup Glass.",
      garnish: "Lemon Twist",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["gin"]
    },
    {
      name: "Paloma",
      ingredients: [
        "1.5 oz Corazon Reposado",
        "1.5 oz Grapefruit Juice",
        "0.5 oz Lime Juice",
        "0.5 oz Agave",
        "Top with Soda Water"
      ],
      method: "Shake, Single Strain over Ice in Collins Glass.",
      garnish: "Grapefruit Slice",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["tequila"]
    },
    {
      name: "Daiquiri",
      ingredients: [
        "2 oz Planterray 3 Star Rum",
        "0.5 oz Maraschino Liqueur",
        "0.75 oz Lime Juice",
        "0.5 oz Grapefruit Juice"
      ],
      method: "Shake, Double Strain into Coup Glass.",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["summer"],
      liquorTypes: ["rum", "liqueur"]
    },
    {
      name: "Cosmo",
      ingredients: [
        "1.5 oz Absolut Citron",
        "0.5 oz Triple Sec",
        "1 oz Cranberry Juice",
        "0.5 oz Lime Juice"
      ],
      method: "Shake, Double Strain into Coup Glass.",
      garnish: "Lime Wheel",
      sweetness: "semi-dry",
      liquorForward: false,
      allergens: [],
      seasons: ["spring", "summer"],
      liquorTypes: ["vodka", "liqueur"]
    }
  )
 // 🧪 Batches to upload
const batches = [
    {
      name: "Citrus Shrub",
      ingredients: [
        "1 qt lemon juice",
        "1 qt lime juice",
        "1 qt orange juice",
        "1 qt grapefruit juice",
        "Zest from 2 oranges, 2 lemons, 4 limes",
        "1.5 qt granulated sugar",
        "2 qt rice wine vinegar"
      ],
      method: "Squeeze zested fruit, cover with cheese cloth, refrigerate 3 days, filter, add vinegar."
    },
    {
      name: "Honey Syrup",
      ingredients: ["50% honey", "50% hot water"],
      method: "Shake to mix, let cool to room temp before refrigerating."
    },
    {
      name: "Simple Syrup",
      ingredients: ["50% sugar", "50% hot water"],
      method: "Shake to mix, let cool to room temp before refrigerating."
    },
    {
      name: "Hibiscus Agave Syrup",
      ingredients: [
        "2 gallons hot water",
        "4 cups hibiscus petals",
        "2 qt agave nectar",
        "2 cups lime juice"
      ],
      method: "Cover and steep 1–2 hours, strain with chinois, compact."
    },
    {
      name: "Mint or Rosemary or Thyme Syrup",
      ingredients: ["1 qt hot water", "1 qt sugar", "Medium bunch of herbs"],
      method: "Bring to boil, simmer 15 min, strain with chinois, compact."
    },
    {
      name: "Cinnamon Syrup",
      ingredients: ["1 qt water", "1 qt sugar", "4 cinnamon sticks"],
      method: "Bring to boil, simmer 15 min with sticks, cool to room temp, remove sticks."
    },
    {
      name: "Pickled Carrots",
      ingredients: ["3 carrots (cut into coins)", "1 qt beet juice"],
      method: "Boil beet juice, pour over carrots, sit 4 hours before cooling."
    },
    {
      name: "Passionfruit Syrup",
      ingredients: ["6 liters passionfruit juice", "2 qt sugar"],
      method: "Stir until sugar is dissolved."
    },
    {
      name: "Cold Brew",
      ingredients: ["1 qt coffee grounds", "1 gallon cold water"],
      method: "Steep 24 hours in cooler, strain through chinois and coffee filter."
    },
    {
      name: "Spicy Tito's",
      ingredients: ["3 bottles Tito's", "4 fresnos", "4 serranos"],
      method: "Blend 1 bottle with peppers, add 2 more bottles, steep 24 hrs, strain with chinois."
    },
    {
      name: "Bloody Mary Mix",
      ingredients: [
        "320 oz Zing Zang",
        "30 oz volcano sauce",
        "12 oz Worcestershire",
        "5 oz lemon juice",
        "10 tsp celery salt",
        "10 tsp cocoa powder",
        "2.5 tsp onion powder"
      ],
      method: "Whisk together, store in large cambro."
    },
    {
      name: "Everly Mimosa Batch",
      ingredients: [
        "6 oz Raspberry Liqueur",
        "6 oz Carpano Bianco",
        "18 oz Orange Juice"
      ],
      method: "Mix ingredients together."
    },
    {
      name: "Petunia Mimosa Batch",
      ingredients: [
        "3 oz Bruto Americano",
        "6 oz Elderflower Liqueur",
        "21 oz Grapefruit Juice"
      ],
      method: "Mix ingredients together."
    },
    {
      name: "Hola Batch",
      ingredients: [
        "45 oz Milagro",
        "15 oz Blood Orange Liqueur",
        "Hibiscus and lime (added when made)"
      ],
      method: "Batch tequila and blood orange liqueur together. Add hibiscus and lime when serving."
    },
    {
      name: "Blackberry Syrup",
      ingredients: [
        "26.25 oz frozen blackberries",
        "1.25 cups water",
        "1.25 cups sugar",
        "2.5 tbsp lemon juice"
      ],
      method: "Bring to boil, mash berries, simmer 15 min, strain with chinois, cool."
    },
    {
      name: "Bitter Batch",
      ingredients: [
        "60 oz Plantaray Rum",
        "30 oz Carpano Antica",
        "7.5 oz Maraschino Liqueur"
      ],
      method: "Mix ingredients together."
    },
    {
      name: "Horizon Batch",
      ingredients: [
        "30 oz Xicaru Mezcal",
        "15 oz Amaro",
        "15 oz Aperol"
      ],
      method: "Mix ingredients together."
    },
    {
      name: "Bloody Mary Skewers",
      ingredients: [
        "Cucumber",
        "Fresno Chili",
        "Gherkin Pickle",
        "Pickled Carrot",
        "Olive"
      ],
      method: "Skewer ingredients together."
    }
  ]
  async function uploadData() {
    // Upload Cocktails
    const { error: cocktailError } = await supabase.from('cocktails').insert(cocktails)
    if (cocktailError) {
      console.error('❌ Error uploading cocktails:', cocktailError)
    } else {
      console.log('✅ Cocktails uploaded successfully!')
    }
  
    // Upload Batches
    const { error: batchError } = await supabase.from('batches').insert(batches)
    if (batchError) {
      console.error('❌ Error uploading batches:', batchError)
    } else {
      console.log('✅ Batches uploaded successfully!')
    }
  }
  
  // 🚀 Run the upload
  uploadData()
       
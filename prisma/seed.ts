import { PrismaClient, ProductCategory, ProductType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@qahwa.co";
  const customerEmail = "customer@qahwa.co";

  await prisma.review.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.wholesaleInquiry.deleteMany({
    where: { email: { in: [adminEmail, customerEmail, "buyer@desertcafe.example"] } },
  });
  await prisma.newsletterSubscriber.deleteMany({
    where: { email: { in: [adminEmail, customerEmail, "guest@qahwa.co"] } },
  });
  await prisma.category.deleteMany({
    where: { slug: { in: ["coffee", "tea", "gift-sets", "accessories"] } },
  });
  await prisma.user.deleteMany({ where: { email: { in: [adminEmail, customerEmail] } } });

  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Qahwa Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: customerEmail,
      name: "Demo Customer",
      role: Role.CUSTOMER,
      passwordHash,
    },
  });

  const coffeeCategory = await prisma.category.create({
    data: {
      name: "Coffee",
      slug: "coffee",
      description: "Single origin and signature blends.",
    },
  });

  const teaCategory = await prisma.category.create({
    data: {
      name: "Tea",
      slug: "tea",
      description: "Traditional and modern tea selections.",
    },
  });

  const giftCategory = await prisma.category.create({
    data: {
      name: "Gift Sets",
      slug: "gift-sets",
      description: "Curated gifts for coffee and tea lovers.",
    },
  });

  await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Brewing tools and essentials.",
    },
  });

  const yemenCoffee = await prisma.product.create({
    data: {
      name: "Yemeni Heritage Roast",
      slug: "yemeni-heritage-roast",
      description: "A rich cup with cocoa depth and dried fruit sweetness.",
      categoryId: coffeeCategory.id,
      category_type: ProductCategory.COFFEE,
      productType: ProductType.SINGLE_ORIGIN,
      origin: "Yemen",
      region: "Haraz",
      flavorNotes: ["cocoa", "dried fig", "cardamom"],
      brewMethods: ["pour over", "french press", "espresso"],
      images: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      ],
      featured: true,
      variants: {
        create: [
          {
            name: "250g - Whole Bean",
            sku: "YHR-250-WB",
            price: 1799,
            stock: 45,
            isDefault: true,
          },
          {
            name: "500g - Espresso Grind",
            sku: "YHR-500-EG",
            price: 3199,
            stock: 30,
          },
        ],
      },
    },
  });

  const houseBlend = await prisma.product.create({
    data: {
      name: "House Blend No. 7",
      slug: "house-blend-no-7",
      description: "Balanced and smooth blend for daily brewing.",
      categoryId: coffeeCategory.id,
      category_type: ProductCategory.COFFEE,
      productType: ProductType.BLEND,
      origin: "Brazil + Ethiopia",
      flavorNotes: ["toffee", "hazelnut", "dark chocolate"],
      brewMethods: ["drip", "french press", "cold brew"],
      images: [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
      ],
      variants: {
        create: [
          {
            name: "250g - Medium Grind",
            sku: "HB7-250-MD",
            price: 1499,
            stock: 60,
            isDefault: true,
          },
        ],
      },
    },
  });

  const karakTea = await prisma.product.create({
    data: {
      name: "Spiced Karak Tea",
      slug: "spiced-karak-tea",
      description: "Bold black tea with aromatic spice warmth.",
      categoryId: teaCategory.id,
      category_type: ProductCategory.TEA,
      productType: ProductType.CHAI,
      flavorNotes: ["cinnamon", "clove", "ginger"],
      brewMethods: ["stovetop", "tea pot"],
      images: [
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
      ],
      variants: {
        create: [
          {
            name: "150g - Loose Leaf",
            sku: "KARAK-150-LL",
            price: 1099,
            stock: 55,
            isDefault: true,
          },
        ],
      },
    },
  });

  const giftBox = await prisma.product.create({
    data: {
      name: "Qahwa Discovery Gift Box",
      slug: "qahwa-discovery-gift-box",
      description: "A curated starter set with coffee, tea, and tasting guide.",
      categoryId: giftCategory.id,
      category_type: ProductCategory.GIFT_SET,
      productType: ProductType.GIFT_BOX,
      flavorNotes: ["mixed origins", "seasonal"],
      brewMethods: ["varied"],
      images: [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38",
      ],
      variants: {
        create: [
          {
            name: "Standard Box",
            sku: "GIFT-BOX-STD",
            price: 4499,
            stock: 20,
            isDefault: true,
          },
        ],
      },
    },
  });

  const featuredCollection = await prisma.collection.create({
    data: {
      name: "Featured Picks",
      slug: "featured-picks",
      description: "Best-selling and editor favorites.",
      featured: true,
    },
  });

  await prisma.collectionProduct.createMany({
    data: [
      { collectionId: featuredCollection.id, productId: yemenCoffee.id, sortOrder: 1 },
      { collectionId: featuredCollection.id, productId: houseBlend.id, sortOrder: 2 },
      { collectionId: featuredCollection.id, productId: giftBox.id, sortOrder: 3 },
    ],
  });

  await prisma.shippingRate.createMany({
    data: [
      {
        name: "Standard UK",
        zone: "UK",
        countries: ["GB"],
        price: 399,
        estimatedDays: "2-4 business days",
        freeAbove: 3500,
      },
      {
        name: "GCC Express",
        zone: "MIDDLE_EAST",
        countries: ["AE", "SA", "KW", "QA", "BH", "OM"],
        price: 1299,
        estimatedDays: "3-6 business days",
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        productId: yemenCoffee.id,
        userId: customer.id,
        rating: 5,
        body: "Excellent depth and sweetness. Perfect for pour-over mornings.",
        approved: true,
      },
      {
        productId: karakTea.id,
        userId: admin.id,
        rating: 4,
        body: "Strong spice profile and great aroma when brewed with milk.",
        approved: true,
      },
    ],
  });

  await prisma.wholesaleInquiry.create({
    data: {
      userId: customer.id,
      firstName: "Nora",
      lastName: "Hassan",
      email: "buyer@desertcafe.example",
      company: "Desert Cafe",
      country: "AE",
      message: "We are interested in monthly wholesale supply for two branches.",
    },
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: customerEmail, userId: customer.id, firstName: "Demo", source: "footer" },
      { email: "guest@qahwa.co", firstName: "Guest", source: "homepage_hero" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete: users, categories, products, variants, collections, and core content created.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
insert into public.categories (slug, name, icon, description, sort_order) values
('business-promotion','Business Promotion','Store','Put your shop, company or local business in front of ready buyers.',1),
('product-promotion','Product Promotion','Package','Showcase a product with images, details and a direct purchase link.',2),
('deals-offers','Deals & Offers','Flame','Limited-time offers and discounts worth grabbing.',3),
('sponsored-articles','Sponsored Articles','Newspaper','In-depth sponsored stories about brands, products and launches.',4),
('new-launches','New Launches','Rocket','Fresh products and services that just hit the market.',5),
('services','Services','Laptop','Local and online services from verified providers.',6),
('featured-products','Featured Products','Gift','Hand-picked products highlighted across AnguliMart.',7),
('trending','Trending','Star','What shoppers are clicking on most right now.',8);

insert into public.businesses (slug, name, category_id, tagline, description, cover_url, city, website, instagram, whatsapp, offer_text, valid_until, status, is_featured) values
('meera-fashion-studio','Meera Fashion Studio',(select id from public.categories where slug='business-promotion'),'Ethnic & festive wear boutique in Hazratganj','Meera Fashion Studio is a Lucknow boutique specialising in chikankari kurtas, festive lehengas and tailored ethnic wear. Walk-in styling support, in-house tailoring and doorstep delivery across Lucknow.','/images/demo/boutique.jpg','Lucknow','https://example.com','meerafashionstudio','918957629511','Flat 20% off on festive collection + free alteration','2026-12-31','published',true),
('shree-electronics','Shree Electronics & Appliances',(select id from public.categories where slug='business-promotion'),'Appliances, audio and smart home at wholesale rates','A family-run electronics store serving Lucknow for 18 years. Authorised dealer for leading audio, kitchen and smart-home brands with same-day installation.',null,'Lucknow','https://example.com','shreeelectronics','918957629511','Exchange bonus up to Rs 3,000 on select appliances','2026-10-31','published',true),
('brewbox-cafe','BrewBox Cafe',(select id from public.categories where slug='services'),'Specialty coffee and workspace in Gomti Nagar','A quiet specialty-coffee cafe with fast wifi, power at every table and a small events room for meetups and shoots.',null,'Lucknow',null,'brewboxcafe','918957629511','Buy 1 get 1 on cold brew, weekdays before 12pm','2026-11-30','published',false),
('pixelcraft-studio','PixelCraft Digital Studio',(select id from public.categories where slug='services'),'Branding, websites and performance marketing','PixelCraft helps small Indian businesses go online: logo and brand kits, fast websites, product photography and paid-ads management.',null,'Lucknow','https://example.com','pixelcraftstudio','918957629511','Free brand audit for first 10 businesses each month','2026-12-15','published',false);

insert into public.products (slug, name, category_id, summary, description, pros, cons, image_url, price, original_price, merchant, affiliate_url, is_featured, is_trending, is_new_launch, status) values
('probuds-air-3-wireless-earbuds','ProBuds Air 3 Wireless Earbuds',(select id from public.categories where slug='featured-products'),'48-hour battery, hybrid ANC and low-latency gaming mode under Rs 3,000.','ProBuds Air 3 pairs hybrid active noise cancellation with a 48-hour total battery life and a 45ms low-latency mode for gaming. IPX5 sweat resistance, dual-device pairing and a USB-C fast charge that gives 3 hours of playback in 10 minutes.','{"Strong ANC for the price","48-hour case battery","Fast USB-C charging"}','{"No wireless charging","Case picks up scratches"}','/images/demo/earbuds.jpg',2499,4999,'Amazon','https://www.amazon.in/',true,true,true,'published'),
('chikankari-cotton-kurta-set','Handcrafted Chikankari Cotton Kurta Set',(select id from public.categories where slug='product-promotion'),'Authentic Lucknowi chikankari on breathable cotton, made by local artisans.','A three-piece chikankari set hand-embroidered in Lucknow: kurta, palazzo and dupatta in soft cotton that stays comfortable through long summer days. Colour-fast dyes and reinforced stitching.','{"Genuine Lucknowi handwork","Breathable summer cotton"}','{"Hand wash recommended"}','/images/demo/boutique.jpg',1899,3200,'Meera Fashion Studio','https://example.com',true,false,false,'published'),
('smart-led-tv-43-4k','VividView 43" 4K Smart LED TV',(select id from public.categories where slug='deals-offers'),'4K HDR panel with Dolby Audio and a genuinely fast smart interface.','A 43-inch 4K HDR10 panel with 20W Dolby Audio output, dual-band wifi and a snappy smart OS with all major streaming apps built in. Includes wall mount and two-year panel warranty.','{"Excellent price per inch","Bright HDR panel"}','{"Remote feels basic"}',null,21999,32999,'Flipkart','https://www.flipkart.com/',false,true,false,'published'),
('stainless-steel-air-fryer-4l','ChefPro 4L Digital Air Fryer',(select id from public.categories where slug='deals-offers'),'Eight presets, rapid-air cooking and a dishwasher-safe basket.','A 1400W digital air fryer with eight one-touch presets, 60-minute timer and a non-stick dishwasher-safe basket. Cooks with up to 85% less oil than deep frying.','{"Easy to clean","Consistent results"}','{"Basket is small for large families"}',null,4499,7999,'Amazon','https://www.amazon.in/',false,false,true,'published'),
('ergonomic-mesh-office-chair','FlexSit Ergonomic Mesh Office Chair',(select id from public.categories where slug='product-promotion'),'Adjustable lumbar support and breathable mesh for long work days.','Built for full work days: adjustable lumbar support, 3D armrests, breathable mesh back, tilt lock and a nylon base rated to 120kg.','{"Real lumbar adjustment","Breathable back"}','{"Assembly takes 20 minutes"}',null,8999,14999,'Amazon','https://www.amazon.in/',true,false,false,'published'),
('solar-led-garden-lights-set','SunGlow Solar LED Garden Lights (Set of 6)',(select id from public.categories where slug='new-launches'),'Dusk-to-dawn solar pathway lights with a 10-hour runtime.','Stainless-steel solar pathway lights that charge in daylight and switch on automatically at dusk for up to 10 hours. IP65 rated for monsoon use.','{"Zero wiring","Monsoon rated"}','{"Dimmer on cloudy days"}',null,1299,2499,'Flipkart','https://www.flipkart.com/',false,true,true,'published'),
('bluetooth-party-speaker-40w','BoomBase 40W Bluetooth Party Speaker',(select id from public.categories where slug='trending'),'40W output, RGB lights and 14-hour playback for house parties.','A 40W portable speaker with dual passive bass radiators, RGB lighting, TWS pairing for stereo sound, aux/SD/USB inputs and 14 hours of playback.','{"Loud for its size","TWS stereo pairing"}','{"Lights drain battery faster"}',null,3299,5999,'Amazon','https://www.amazon.in/',false,true,false,'published'),
('premium-leather-office-bag','Urbane Leather Laptop Messenger Bag',(select id from public.categories where slug='featured-products'),'Full-grain leather bag that fits a 15.6" laptop and everyday carry.','Hand-finished full-grain leather messenger with padded 15.6-inch laptop sleeve, organiser pockets, brass hardware and an adjustable canvas strap.','{"Ages beautifully","Well-padded sleeve"}','{"Heavier than nylon bags"}',null,4999,8999,'Amazon','https://www.amazon.in/',false,false,false,'published');

insert into public.articles (slug, title, excerpt, content, image_url, category_id, tags, seo_title, meta_description, is_sponsored, is_featured, status, published_at) values
('best-wireless-earbuds-under-3000','Best Wireless Earbuds Under Rs 3,000 in 2026','We tested the budget earbuds people actually buy in India and picked the five worth your money.',
'Budget earbuds have quietly become very good. Under Rs 3,000 you can now get hybrid active noise cancellation, 40+ hours of case battery and a low-latency gaming mode that used to be reserved for premium models.

## What we looked for

Battery honesty, call clarity on an Indian street, ANC that actually reduces traffic rumble, and comfort over a two-hour stretch.

## Our top pick

The ProBuds Air 3 leads on battery and ANC, and the fast-charge claim held up in testing: ten minutes gave us just over three hours of playback.

## Runners-up

Look for IPX5 or better if you commute or work out, and skip anything that promises ANC without naming the number of microphones.

## Buying advice

Pay for battery and comfort before you pay for extra drivers. And check the warranty path — a local service option matters more than a spec sheet.',
'/images/demo/earbuds.jpg',(select id from public.categories where slug='sponsored-articles'),'{earbuds,audio,buying guide}','Best Wireless Earbuds Under Rs 3,000 (2026) — Tested Picks','We tested budget wireless earbuds under Rs 3,000 in India and picked five that are genuinely worth buying in 2026.',false,true,'published',now() - interval '3 days'),
('meera-fashion-studio-festive-collection','Inside Meera Fashion Studio''s New Festive Collection','How a Hazratganj boutique turned traditional chikankari into a modern festive wardrobe.',
'Meera Fashion Studio has been stitching chikankari for two decades, and this year''s festive line is its most contemporary yet.

## The collection

Pastel cotton kurta sets for daytime functions, heavier organza lehengas for weddings, and a co-ord range aimed at younger shoppers who want handwork without the weight.

## Why it matters locally

Every piece is embroidered by artisans working within Lucknow, and the studio publishes its tailoring timelines up front — usually four to six days for alterations.

## Visiting

The Hazratganj studio offers walk-in styling appointments, and the team ships across India.',
'/images/demo/boutique.jpg',(select id from public.categories where slug='business-promotion'),'{fashion,lucknow,sponsored}','Meera Fashion Studio Festive Collection 2026 — Lucknow Chikankari','A look inside Meera Fashion Studio''s new festive chikankari collection in Lucknow, from pastel kurta sets to wedding lehengas.',true,true,'published',now() - interval '6 days'),
('how-to-promote-a-small-business-online-in-india','How to Promote a Small Business Online in India (2026 Playbook)','A practical, low-budget sequence for getting your shop discovered — no agency required.',
'Most small businesses do not need a bigger budget. They need a sequence.

## 1. Fix your basics

A Google Business Profile with real photos, correct hours and a working WhatsApp link beats a fancy website with no traffic.

## 2. Publish proof

Post the work, not the discount. Before-and-after photos, customer notes, delivery timelines.

## 3. Get listed where buyers look

Local listings, category pages and promotion platforms put you in front of people already searching for what you sell.

## 4. Make contact effortless

One tap to WhatsApp. No forms with twelve fields.

## 5. Measure the source

Ask every enquiry where it came from, or use links that tell you automatically.',
null,(select id from public.categories where slug='services'),'{marketing,small business,guide}','How to Promote a Small Business Online in India — 2026 Playbook','A practical five-step playbook for promoting a small Indian business online in 2026, from Google Business Profile to tracking lead sources.',false,false,'published',now() - interval '10 days'),
('festive-season-deals-worth-buying','Festive Season Deals Actually Worth Buying This Month','Discount percentages lie. Here is how to tell a real festive deal from a marked-up one.',
'Festive sales inflate the "original" price as often as they cut the real one. A few checks separate the two.

## Track the 90-day price

If the product sat at Rs 4,999 for three months, a Rs 4,499 "festive price" is not a deal.

## Watch the bundle

Bank cashback and exchange bonuses are often where the genuine saving lives.

## Buy the category, not the banner

Appliances and audio see real festive discounts. Fast-moving accessories rarely do.',
null,(select id from public.categories where slug='deals-offers'),'{deals,festive,shopping}','Festive Season Deals Worth Buying — How to Spot a Real Discount','How to tell a genuine festive discount from a marked-up one, plus the product categories where festive deals are actually real.',false,false,'published',now() - interval '1 day');

insert into public.promotions (title, promotion_type, contact_name, business_name, whatsapp, city, category_id, website, notes, target_url, amount, payment_status, status, is_featured, start_date, expiry_date) values
('Meera Fashion Studio — Festive Featured Slot','featured','Meera Verma','Meera Fashion Studio','918957629511','Lucknow',(select id from public.categories where slug='business-promotion'),'https://example.com','Homepage featured placement for the festive season.','/business/meera-fashion-studio',4999,'paid','published',true,current_date - 5,current_date + 40),
('Shree Electronics — Exchange Offer Banner','banner','Rohit Gupta','Shree Electronics & Appliances','918957629511','Lucknow',(select id from public.categories where slug='deals-offers'),null,'Sidebar banner across deals pages.','/business/shree-electronics',2499,'paid','published',false,current_date - 2,current_date + 28),
('PixelCraft Studio — Sponsored Article','article','Ankur Singh','PixelCraft Digital Studio','918957629511','Lucknow',(select id from public.categories where slug='services'),'https://example.com','Sponsored article about branding services. Awaiting payment confirmation.',null,3499,'payment_pending','pending',false,current_date,current_date + 30);

insert into public.banners (title, image_url, destination_url, placement, start_date, expiry_date, is_active) values
('Festive Collection — Meera Fashion Studio','/images/demo/boutique.jpg','/business/meera-fashion-studio','home_top',current_date - 5,current_date + 40,true);

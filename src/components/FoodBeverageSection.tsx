import React, { useRef, useState, useEffect } from 'react';
import './FoodBeverageSection.css';

export interface FoodBeverageSectionProps {
  canAnimate?: boolean;
  onNavigate?: (id: string) => void;
}

export interface MenuItemChoiceGroup {
  pasta?: string[];
  sauce?: string[];
}

export interface MenuItemMedia {
  transparentPng?: string;
  transparentWebm?: string; // WebM VP9 with alpha (future cinematic animation)
  poster?: string;
  hasTransparentAsset: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price?: string; // e.g., '₹225/-', undefined if unconfirmed
  description: string;
  isVegetarian?: boolean;
  isNonVegetarian?: boolean;
  benefit?: string;
  ingredients?: string;
  choices?: MenuItemChoiceGroup;
  media: MenuItemMedia;
}

export interface MenuCategory {
  id: string;
  name: string;
  subtitle?: string;
  sourceNote?: string;
  categoryPrice?: string;
  items: MenuItem[];
}

export const AUTHORITATIVE_MENU_DATA: MenuCategory[] = [
  {
    id: 'hot-beverages',
    name: 'Hot Beverages',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        price: '₹225/-',
        description: 'A rich and intense single shot of freshly brewed coffee.',
        media: {
          transparentPng: '/images/menu-espresso-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'doppio',
        name: 'Doppio',
        price: '₹275/-',
        description: 'A double shot of espresso, offering a bold and full-bodied flavour.',
        media: {
          transparentPng: '/images/menu-doppio-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'classic-black-coffee',
        name: 'Classic Black Coffee',
        price: '₹225/-',
        description: 'Espresso topped with hot water for a clean, balanced and smooth cup.',
        media: {
          transparentPng: '/images/menu-classic-black-coffee-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        price: '₹275/-',
        description: 'A classic blend of espresso, steamed milk and velvety milk foam.',
        media: {
          transparentPng: '/images/menu-cappuccino-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'latte-macchiato',
        name: 'Latte Macchiato',
        price: '₹275/-',
        description: 'Steamed milk layered with a shot of espresso for a smooth and creamy coffee. Silky micro-foam for a rich, balanced flavour.',
        media: {
          transparentPng: '/images/menu-latte-macchiato-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'cortado',
        name: 'Cortado',
        price: '₹275/-',
        description: 'Equal parts espresso and steamed milk, creating a perfectly balanced coffee.',
        media: {
          transparentPng: '/images/menu-cortado-isolated.png',
          hasTransparentAsset: true,
        },
      },
    ],
  },
  {
    id: 'cold-beverages',
    name: 'Cold Beverages',
    items: [
      {
        id: 'iced-espresso',
        name: 'Iced Espresso',
        price: '₹250/-',
        description: 'Freshly brewed espresso served over ice for a bold and refreshing coffee.',
        media: {
          transparentPng: '/images/menu-iced-espresso-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'iced-americano',
        name: 'Iced Americano',
        price: '₹250/-',
        description: 'Espresso combined with chilled water and ice for a crisp, smooth finish.',
        media: {
          transparentPng: '/images/menu-iced-americano-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'iced-latte',
        name: 'Iced Latte',
        price: '₹275/-',
        description: 'Smooth cold brew blended with chilled milk for a rich and velvety finish.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'iced-cappuccino',
        name: 'Iced Cappuccino',
        price: '₹275/-',
        description: 'Espresso, chilled milk and light milk foam served over ice for a refreshing classic.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'affogato',
        name: 'Affogato',
        price: '₹275/-',
        description: 'A hot, freshly brewed shot of espresso poured directly over the ice cream right before serving.',
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
  {
    id: 'botanical-spiced',
    name: 'Botanical & Spiced Drinks',
    sourceNote: 'No white sugar — only sweetened with Desi Khand / Raw Unrefined Cane Sugar.',
    items: [
      {
        id: 'house-lemonade',
        name: 'House Lemonade',
        price: '₹250/-',
        description: "Kosha's version of sweet and salted classic lemonade.",
        media: {
          transparentPng: '/images/menu-house-lemonade-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'ginger-ale',
        name: 'Ginger Ale',
        price: undefined, // Price not individually confirmed in source PDF
        description: 'A classic fav mild ginger drink',
        media: {
          transparentPng: '/images/menu-ginger-ale-isolated.png',
          hasTransparentAsset: true,
        },
      },
      {
        id: 'jal-zeera',
        name: 'Jal-Zeera',
        price: undefined, // Price not individually confirmed in source PDF
        description: 'Cumin and masala-based drink.',
        media: {
          transparentPng: '/images/menu-jal-zeera-isolated.png',
          hasTransparentAsset: true,
        },
      },
    ],
  },
  {
    id: 'puffs-baked-treats',
    name: 'Puffs & Baked Treats',
    subtitle: 'Eggless Vegetable Puffs with crusty upper layer coating.',
    items: [
      {
        id: 'english-vegetables-puff',
        name: 'English vegetables',
        price: '₹250/-',
        isVegetarian: true,
        description: 'Eggless vegetable puff filled with garden English vegetables inside a crisp, crusty upper layer.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'mushroom-puff',
        name: 'Mushroom',
        price: undefined, // Price not individually confirmed in source PDF
        isVegetarian: true,
        description: 'Savory sautéed mushrooms wrapped in flaky hearth-baked layers.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'cheese-quattro-formaggi-puff',
        name: 'Cheese Quattro Formaggi',
        price: undefined, // Price not individually confirmed in source PDF
        isVegetarian: true,
        description: 'Four-cheese artisanal blend with rich melted texture and golden crust.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'cottage-cheese-puff',
        name: 'Cottage cheese',
        price: undefined, // Price not individually confirmed in source PDF
        isVegetarian: true,
        description: 'Mildly spiced cottage cheese filling baked in golden puff pastry.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'chicken-mustard-puff',
        name: 'Chicken Mustard',
        price: undefined, // Price not individually confirmed in source PDF
        isNonVegetarian: true,
        description: 'Tender chicken tossed with wholegrain mustard in a crusty pastry layer.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'chicken-peri-peri-puff',
        name: 'Chicken Peri Peri',
        price: undefined, // Price not individually confirmed in source PDF
        isNonVegetarian: true,
        description: 'Zesty spiced chicken peri-peri enveloped in crisp, delicate baked pastry.',
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
  {
    id: 'burgers',
    name: 'Burgers',
    subtitle: 'Served with French Fries.',
    items: [
      {
        id: 'kosha-special-veg-burger',
        name: 'KOSHA Special Veg (Beetroot Patty)',
        price: '₹525/-',
        isVegetarian: true,
        description: 'Signature house-crafted beetroot patty on artisanal brioche, served with crispy French Fries.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'kosha-veg-burger',
        name: 'KOSHA Veg',
        price: '₹495/-',
        isVegetarian: true,
        description: 'Crisp garden vegetable patty layered with fresh greens and house sauce, served with French Fries.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'meat-the-bun-burger',
        name: 'Meat the Bun (Chicken Patty)',
        price: '₹525/-',
        isNonVegetarian: true,
        description: 'Juicy handcrafted chicken patty seasoned with select spices, served with golden French Fries.',
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
  {
    id: 'pasta-lab',
    name: 'Pasta Lab',
    subtitle: 'Choose your pasta shape and sauce style.',
    items: [
      {
        id: 'pasta-vegetarian',
        name: 'Vegetarian',
        price: '₹545/-',
        isVegetarian: true,
        description: 'Handcrafted pasta tossed with seasonal farm vegetables and your choice of house sauce.',
        choices: {
          pasta: ['Spaghetti', 'Penne', 'Fettuccine'],
          sauce: ['Pomodoro', 'Alfredo', 'Aglio olio'],
        },
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'pasta-non-vegetarian',
        name: 'Non-vegetarian',
        price: '₹595/-',
        isNonVegetarian: true,
        description: 'Artisanal pasta paired with tender chicken preparation and your selected sauce.',
        choices: {
          pasta: ['Spaghetti', 'Penne', 'Fettuccine'],
          sauce: ['Pomodoro', 'Alfredo', 'Aglio olio'],
        },
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
  {
    id: 'bakery',
    name: 'Bakery',
    subtitle: 'Freshly baked daily at the KOSHĀ hearth.',
    items: [
      {
        id: 'tea-cake-slice',
        name: 'Tea Cake Slice — Chocolate Walnut Date',
        price: '₹250/-',
        description: 'Moist hearth-baked tea cake slice with Belgian chocolate, roasted walnuts, and sweet dates.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'jumbo-cookie-peanut-butter',
        name: 'Jumbo Cookie — Peanut butter cookie',
        price: '₹250/-',
        description: 'Warm jumbo cookie made with roasted peanut butter, crisp edges, and a chewy center.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'jumbo-cookie-five-seeds',
        name: 'Jumbo Cookie — Five seeds jaggery cookie',
        price: undefined, // Price not individually confirmed in source PDF
        description: 'Artisanal cookie naturally sweetened with unrefined jaggery and loaded with roasted seeds.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'jumbo-cookie-choco-chip',
        name: 'Jumbo Cookie — Choco Chip Cookie',
        price: undefined, // Price not individually confirmed in source PDF
        description: 'Classic oversized hearth cookie folded with premium melted chocolate chips.',
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
  {
    id: 'wellness-beverages',
    name: 'Wellness Beverages',
    subtitle: 'Crafted using Fresh fruits · Vegetables · Nuts · Seeds',
    sourceNote: 'These beverages are intended to support a balanced lifestyle and overall wellbeing. They are not intended to diagnose, treat, cure or prevent any medical condition.',
    items: [
      {
        id: 'drop-that-kilo',
        name: 'Drop That Kilo (Cold-pressed Juice)',
        price: '₹300/-',
        benefit: 'Weight Management',
        ingredients: 'Spinach · Apple · Watermelon',
        description: 'Pure cold-pressed juice crafted with fresh spinach, crisp apple, and hydrating watermelon.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'love-your-liver',
        name: 'Love Your Liver (Cold-pressed Juice)',
        price: '₹300/-',
        benefit: 'Natural Detox',
        ingredients: 'Beetroot · Apple · Lemon · Mint',
        description: 'Vibrant cold-pressed blend of earthy beetroot, sweet apple, citrus lemon, and cooling mint.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'ginger-zinger',
        name: 'Ginger Zinger (Cold-pressed Juice)',
        price: '₹300/-',
        benefit: 'Anti-Inflammatory',
        ingredients: 'Ginger · Turmeric · Carrot · Orange · Lemon · Celery',
        description: 'Invigorating press rich in fresh ginger root, turmeric, crisp carrot, citrus, and celery.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'scale-up',
        name: 'Scale Up (Wellness Shake)',
        price: '₹400/-',
        benefit: 'Healthy Weight Gain',
        ingredients: 'Banana · Almond milk · Almond butter · Dates · Mixed nuts · Seeds',
        description: 'Nutrient-rich vitality shake blended with ripe banana, almond milk, creamy nut butter, and seeds.',
        media: {
          hasTransparentAsset: false,
        },
      },
      {
        id: 'fountain-of-youth',
        name: 'Fountain of Youth (Wellness Shake)',
        price: '₹400/-',
        benefit: 'Skin & Hair Nourishment',
        ingredients: 'Papaya · Mixed berries · Almond milk · Pomegranate',
        description: 'Antioxidant-dense nourishment shake blended with sweet papaya, wild berries, and ruby pomegranate.',
        media: {
          hasTransparentAsset: false,
        },
      },
    ],
  },
];

export const FoodBeverageSection: React.FC<FoodBeverageSectionProps> = ({
  canAnimate = true,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Active Category State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('hot-beverages');

  // Active Menu Item State (Initial: Espresso)
  const [selectedItemId, setSelectedItemId] = useState<string>('espresso');

  // Interactive Pasta Lab choices state
  const [selectedPastaShape, setSelectedPastaShape] = useState<string>('Spaghetti');
  const [selectedPastaSauce, setSelectedPastaSauce] = useState<string>('Pomodoro');

  // Crossfade transition state for right visual stage
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const [renderedItemId, setRenderedItemId] = useState<string>('espresso');

  // Entrance reveal observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (!canAnimate) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentElem = sectionRef.current;
    if (!currentElem) {
      setIsVisible(true);
      return;
    }

    const rect = currentElem.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0) {
      setIsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry && entry.isIntersecting) {
            setIsVisible(true);
            if (observer && entry.target) {
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(currentElem);
    } catch {
      setIsVisible(true);
    }

    const safetyTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => {
      window.clearTimeout(safetyTimer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [canAnimate]);

  // Handle Category Switching
  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === selectedCategoryId) return;

    setSelectedCategoryId(categoryId);
    const category = AUTHORITATIVE_MENU_DATA.find((c) => c.id === categoryId);
    if (category && category.items.length > 0) {
      const firstItem = category.items[0];
      handleSelectItem(firstItem.id);
    }
  };

  // Handle Item Selection with graceful 300ms crossfade
  const handleSelectItem = (itemId: string) => {
    if (itemId === selectedItemId) return;

    setSelectedItemId(itemId);
    setIsCrossfading(true);

    window.setTimeout(() => {
      setRenderedItemId(itemId);
      setIsCrossfading(false);
    }, 180);
  };

  // Find active category and item objects
  const currentCategory =
    AUTHORITATIVE_MENU_DATA.find((c) => c.id === selectedCategoryId) ||
    AUTHORITATIVE_MENU_DATA[0];

  const selectedItem =
    currentCategory.items.find((item) => item.id === selectedItemId) ||
    currentCategory.items[0];

  const renderedItem =
    AUTHORITATIVE_MENU_DATA.flatMap((c) => c.items).find(
      (item) => item.id === renderedItemId
    ) || selectedItem;

  const shouldAnimate = canAnimate && isVisible;

  return (
    <section
      id="menu"
      ref={sectionRef}
      className={`kosha-menu-section ${shouldAnimate ? 'is-revealed' : ''}`}
      aria-labelledby="menu-headline"
    >
      <div className="kosha-menu-inner">
        {/* Editorial Section Introduction */}
        <header className="kosha-menu-header">
          <div className="kosha-menu-meta-row">
            <span className="kosha-menu-meta-badge">03 / MENU</span>
            <span className="kosha-menu-meta-divider">·</span>
            <span className="kosha-menu-meta-tagline">
              SEASONAL SELECTION · HANDCRAFTED TASTE
            </span>
          </div>

          <div className="kosha-menu-divider" aria-hidden="true" />

          <div className="kosha-menu-title-row">
            <h2 id="menu-headline" className="kosha-menu-headline">
              Crafted with Intention.
            </h2>
            <p className="kosha-menu-lead">
              Seasonal ingredients, thoughtful craft, and little moments worth
              slowing down for.
            </p>
          </div>
        </header>

        {/* Horizontal Category Navigation Pills */}
        <nav
          className="kosha-menu-categories-nav"
          aria-label="Menu categories"
        >
          <div
            className="kosha-menu-categories-track"
            role="tablist"
            aria-orientation="horizontal"
          >
            {AUTHORITATIVE_MENU_DATA.map((cat) => {
              const isActive = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  id={`tab-${cat.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  className={`kosha-category-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleSelectCategory(cat.id)}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Two-Area Interactive Workspace */}
        <div
          id={`panel-${currentCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentCategory.id}`}
          className="kosha-menu-workspace"
        >
          {/* Left Workspace (~40–45%): Editorial Item List */}
          <div className="kosha-menu-list-col">
            {/* Category Subtitle or Source Note */}
            {currentCategory.subtitle && (
              <p className="kosha-category-subtitle">
                {currentCategory.subtitle}
              </p>
            )}

            {currentCategory.sourceNote && (
              <div className="kosha-category-note-wrap">
                <span className="kosha-category-note-dot" aria-hidden="true" />
                <p className="kosha-category-note-text">
                  {currentCategory.sourceNote}
                </p>
              </div>
            )}

            {/* Editorial List of Items */}
            <div className="kosha-editorial-list" role="list">
              {currentCategory.items.map((item) => {
                const isSelected = item.id === selectedItemId;

                return (
                  <div
                    key={item.id}
                    role="listitem"
                    className={`kosha-item-row-wrap ${isSelected ? 'is-selected' : ''}`}
                  >
                    <button
                      type="button"
                      className="kosha-item-trigger"
                      onClick={() => handleSelectItem(item.id)}
                      aria-expanded={isSelected}
                      aria-controls={`desc-${item.id}`}
                    >
                      <div className="kosha-item-title-group">
                        {item.isVegetarian && (
                          <span
                            className="kosha-diet-indicator veg"
                            title="Vegetarian"
                            aria-label="Vegetarian"
                          />
                        )}
                        {item.isNonVegetarian && (
                          <span
                            className="kosha-diet-indicator non-veg"
                            title="Non-vegetarian"
                            aria-label="Non-vegetarian"
                          />
                        )}
                        <span className="kosha-item-name">{item.name}</span>
                      </div>

                      <div className="kosha-item-price-group">
                        {item.price ? (
                          <span className="kosha-item-price">{item.price}</span>
                        ) : (
                          <span className="kosha-item-unlisted-price" title="Price confirmed upon fresh preparation">
                            —
                          </span>
                        )}
                        <span
                          className={`kosha-item-chevron ${isSelected ? 'is-open' : ''}`}
                          aria-hidden="true"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {/* Inline Expanded Detail */}
                    {isSelected && (
                      <div
                        id={`desc-${item.id}`}
                        className="kosha-item-expanded-content"
                      >
                        <p className="kosha-item-description">
                          {item.description}
                        </p>

                        {/* Wellness Benefit & Ingredients */}
                        {item.benefit && (
                          <div className="kosha-wellness-meta">
                            <span className="kosha-benefit-pill">
                              <span className="kosha-benefit-dot" aria-hidden="true" />
                              <span>{item.benefit}</span>
                            </span>
                            {item.ingredients && (
                              <p className="kosha-ingredients-line">
                                <span className="kosha-ingredients-label">Ingredients:</span>{' '}
                                {item.ingredients}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pasta Lab Interactive Choices */}
                        {item.choices && (
                          <div className="kosha-pasta-choices-block">
                            {item.choices.pasta && (
                              <div className="kosha-choice-group">
                                <span className="kosha-choice-label">Choose Pasta:</span>
                                <div className="kosha-choice-chips" role="radiogroup" aria-label="Pasta shape choices">
                                  {item.choices.pasta.map((shape) => (
                                    <button
                                      key={shape}
                                      type="button"
                                      role="radio"
                                      aria-checked={selectedPastaShape === shape}
                                      className={`kosha-choice-chip ${selectedPastaShape === shape ? 'is-active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPastaShape(shape);
                                      }}
                                    >
                                      {shape}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.choices.sauce && (
                              <div className="kosha-choice-group">
                                <span className="kosha-choice-label">Choose Sauce:</span>
                                <div className="kosha-choice-chips" role="radiogroup" aria-label="Pasta sauce choices">
                                  {item.choices.sauce.map((sauce) => (
                                    <button
                                      key={sauce}
                                      type="button"
                                      role="radio"
                                      aria-checked={selectedPastaSauce === sauce}
                                      className={`kosha-choice-chip ${selectedPastaSauce === sauce ? 'is-active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPastaSauce(sauce);
                                      }}
                                    >
                                      {sauce}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {!item.price && (
                          <p className="kosha-unconfirmed-price-note">
                            Price confirmed upon seasonal hearth preparation.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Workspace (~50–55%): Isolated 3D Beverage Stage */}
          <div className="kosha-menu-stage-col" aria-live="polite">
            <div className="kosha-stage-wrapper">
              <div
                className={`kosha-isolated-stage ${isCrossfading ? 'is-fading' : ''}`}
              >
                {renderedItem.media.hasTransparentAsset &&
                (renderedItem.media.transparentWebm || renderedItem.media.transparentPng) ? (
                  <div className="kosha-beverage-visual-wrap">
                    {renderedItem.media.transparentWebm ? (
                      <video
                        key={renderedItem.media.transparentWebm}
                        src={renderedItem.media.transparentWebm}
                        poster={renderedItem.media.transparentPng || renderedItem.media.poster}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="kosha-isolated-beverage-video"
                        aria-label={`${renderedItem.name} served at KOSHĀ`}
                      />
                    ) : (
                      <img
                        src={renderedItem.media.transparentPng}
                        alt={`${renderedItem.name} served at KOSHĀ`}
                        className="kosha-isolated-beverage-img"
                        loading="eager"
                        decoding="async"
                      />
                    )}
                    {/* Natural soft physically plausible ambient radial shadow */}
                    <div className="kosha-beverage-ambient-shadow" aria-hidden="true" />
                  </div>
                ) : (
                  /* Editorial Craft Placeholder: Completely borderless against #F5F0E5 */
                  <div className="kosha-craft-pending-stage">
                    <div className="kosha-craft-pending-symbol" aria-hidden="true">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#71836A"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span className="kosha-craft-pending-eyebrow">
                      03 / CRAFT LAB
                    </span>
                    <h3 className="kosha-craft-pending-title">
                      {renderedItem.name}
                    </h3>
                    {renderedItem.price && (
                      <span className="kosha-craft-pending-price">
                        {renderedItem.price}
                      </span>
                    )}
                    <p className="kosha-craft-pending-desc">
                      Authoritative launch menu selection. 3D cinematic animation asset in craft production.
                    </p>
                    <div className="kosha-craft-pending-shadow" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodBeverageSection;

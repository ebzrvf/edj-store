import { useMemo, useState } from "react";

const initialProducts = [
  {
    id: "hoodie-1",
    category: "Худи",
    title: "Balenciaga",
    price: 285000,
    badge: "New",
    image: "/images/hoodie-1.jpg",
    description: "Плотное худи Balenciaga из мягкого хлопка."
  },
  {
    id: "tee-1",
    category: "Футболки",
    title: "Loro Piana",
    price: 330000,
    badge: "Basic",
    image: "/images/tee-1.jpg",
    description: "Базовая футболка на каждый день."
  },
  {
    id: "shorts-1",
    category: "Шорты",
    title: "LV Шорты (Louis Vuitton)",
    price: 478000,
    badge: "Drop",
    image: "/images/shorts-1.jpg",
    description: "Минималистический дизайн."
  },
  {
    id: "shoes-1",
    category: "Обувь",
    title: "New Balance 2002R",
    price: 736000,
    badge: "Hot",
    image: "./images/nblue1.jpg",
    images: {
      gray: [
        "./images/nbgray1.jpg",
        "./images/nbgray2.jpg"
      ],
      blue: [
        "./images/nblue1.jpg",
        "./images/nblue2.jpg"
      ]
    },
    description: "Кроссовки New Balance 2002R. Доступны серый и синий цвет."
  },
  {
    id: "accessory-1",
    category: "Аксессуары",
    title: "Urban Cap",
    price: 149000,
    badge: "Style",
    image: "/images/accessory-1.jpg",
    description: "Кепка с минималистичным дизайном."
  }
];

const categoryMeta = {
  Худи: {
    image: "/images/hoodie-1.jpg"
  },
  Футболки: {
    image: "/images/tee-1.jpg"
  },
  Шорты: {
    image: "/images/shorts-1.jpg"
  },
  Обувь: {
    image: "/images/shoes-gray-1.jpg"
  },
  Аксессуары: {
    image: "/images/accessory-1.jpg"
  }
};

const formatPrice = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} сум`;

const getItemWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return "товар";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "товара";
  return "товаров";
};

export default function ClothingMarketplaceMobileUI() {
  const telegramLink = "https://t.me/ebzrvf";
  const checkoutLink = "https://t.me/nsrvv007";
  const [page, setPage] = useState("market");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [shoeColor, setShoeColor] = useState("gray");
  const [shoeImageIndex, setShoeImageIndex] = useState(0);

  const categories = useMemo(() => {
    return Object.keys(categoryMeta).map((title) => {
      const categoryProducts = products.filter((item) => item.category === title);
      const cheapest = categoryProducts.length
        ? Math.min(...categoryProducts.map((item) => item.price))
        : null;

      return {
        title,
        count: `${categoryProducts.length} ${getItemWord(categoryProducts.length)}`,
        range: cheapest ? `от ${formatPrice(cheapest)}` : "Пусто",
        image: categoryProducts[0]?.image || categoryMeta[title].image
      };
    });
  }, [products]);

  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return categories;

    return categories.filter((item) => {
      const hasProductMatch = products.some((product) => {
        return (
          product.category === item.title &&
          `${product.title} ${product.description}`.toLowerCase().includes(normalized)
        );
      });

      return item.title.toLowerCase().includes(normalized) || hasProductMatch;
    });
  }, [categories, products, search]);

  const selectedProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter((item) => item.category === selectedCategory);
  }, [products, selectedCategory]);

  const cartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product) return null;

        return {
          ...product,
          quantity: entry.quantity,
          selectedColor: entry.selectedColor,
          image: entry.selectedImage || product.image
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product) => {
    const selectedColor = product.id === "shoes-1" ? shoeColor : null;
    const selectedImage =
      product.id === "shoes-1" && product.images
        ? product.images[shoeColor][shoeImageIndex]
        : product.image;

    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === product.id && item.selectedColor === selectedColor
      );

      if (existing) {
        return current.map((item) =>
          item.productId === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          quantity: 1,
          selectedColor,
          selectedImage
        }
      ];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setPage("category");
    if (category === "Обувь") {
      setShoeColor("gray");
      setShoeImageIndex(0);
    }
  };

  const navItems = [
    { key: "market", label: "Каталог", icon: "⌘" },
    { key: "cart", label: "Корзина", icon: "🛍️" },
    { key: "support", label: "Support", icon: "✈️" }
  ];

  const renderHeader = () => (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-black px-4 pb-3 pt-4">
      <div className="relative flex items-center justify-center text-sm text-white/90">
        {page === "category" ? (
          <button
            type="button"
            onClick={() => {
              setPage("market");
              setSelectedCategory(null);
            }}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-lg text-white"
            aria-label="Назад"
          >
            ←
          </button>
        ) : null}

        <div className="text-base font-semibold tracking-wide"></div>
      </div>

      {page === "market" ? (
        <div className="mt-3 rounded-[20px] border border-white/10 bg-black px-4 py-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>
      ) : null}
    </div>
  );

  const renderShoeGallery = (item) => {
    if (item.id !== "shoes-1" || !item.images) return null;

    return (
      <div className="flex flex-col gap-3 px-4 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShoeColor("gray");
              setShoeImageIndex(0);
            }}
            className={`h-6 w-6 rounded-full border ${
              shoeColor === "gray" ? "border-white" : "border-white/30"
            }`}
            style={{ background: "#9ca3af" }}
            aria-label="Серый цвет"
          />
          <button
            type="button"
            onClick={() => {
              setShoeColor("blue");
              setShoeImageIndex(0);
            }}
            className={`h-6 w-6 rounded-full border ${
              shoeColor === "blue" ? "border-white" : "border-white/30"
            }`}
            style={{ background: "#2563eb" }}
            aria-label="Синий цвет"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {item.images[shoeColor].map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setShoeImageIndex(index)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border ${
                shoeImageIndex === index ? "border-white" : "border-white/20"
              }`}
            >
              <img src={img} alt={`${item.title} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketPage = () => (
    <div className="px-4 pb-40 pt-4">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">Каталог</h2>
            <p className="text-sm text-white/55">Разделы:</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-xs text-white/70">
            {filteredCategories.length}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredCategories.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => openCategory(item.title)}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] p-3 text-left shadow-[0_20px_50px_rgba(0,0,0,0.22)] transition active:scale-[0.99]"
            >
              <div className="mb-3 aspect-[0.95] overflow-hidden rounded-[24px] bg-white/5">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="mb-1 text-xs text-white/45">{item.count}</div>
              <div className="text-xl font-semibold leading-tight">{item.title}</div>
              <div className="mt-1 text-sm text-white/65">{item.range}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCategoryPage = () => (
    <div className="px-4 pb-40 pt-4">
      <div className="mb-5 rounded-[32px] border border-white/10 bg-white/[0.08] p-5">
        <div className="mb-2 text-[28px] font-semibold tracking-tight">{selectedCategory}</div>
      </div>

      <div className="space-y-4">
        {selectedProducts.length ? (
          selectedProducts.map((item) => {
            const activeImage =
              item.id === "shoes-1" && item.images
                ? item.images[shoeColor][shoeImageIndex]
                : item.image;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08]"
              >
                <div className="aspect-[16/12] overflow-hidden">
                  <img src={activeImage} alt={item.title} className="h-full w-full object-cover" />
                </div>

                {renderShoeGallery(item)}

                <div className="p-4">
                  <div className="mb-2 text-lg font-semibold">{item.title}</div>
                  <div className="mb-2 text-sm text-white/65">{item.description}</div>
                  <div className="mb-4 text-base font-semibold">{formatPrice(item.price)}</div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="flex-1 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black"
                    >
                      Добавить в корзину
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[30px] border border-white/10 bg-white/[0.08] p-6 text-center text-white/60">
            Вещей пока что нет.
          </div>
        )}
      </div>
    </div>
  );

  const renderCartPage = () => (
    <div className="px-4 pb-40 pt-4">
      <div className="mb-5 rounded-[32px] border border-white/10 bg-white/[0.08] p-5">
        <div className="text-[28px] font-semibold tracking-tight">Корзина</div>
        <p className="mt-2 text-sm text-white/60">Скорее беги за покупками!</p>
      </div>

      <div className="space-y-4">
        {cartItems.length ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-[30px] border border-white/10 bg-white/[0.08] p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-24 w-24 rounded-[22px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-white/60">{item.category}</div>
                {item.selectedColor ? (
                  <div className="mt-1 text-sm text-white/50">
                    Цвет: {item.selectedColor === "gray" ? "Серый" : "Синий"}
                  </div>
                ) : null}
                <div className="mt-2 text-sm font-semibold">{formatPrice(item.price)}</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-white/10 bg-black/20 p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="h-8 w-8 rounded-full bg-white/10"
                    >
                      −
                    </button>
                    <div className="w-10 text-center text-sm">{item.quantity}</div>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="h-8 w-8 rounded-full bg-white text-black"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-white/55"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[30px] border border-white/10 bg-white/[0.08] p-6 text-center text-white/60">
            Корзина пуста.
          </div>
        )}
      </div>

      <div className="mt-5 rounded-[32px] border border-white/10 bg-white/[0.08] p-5">
        <div className="mb-2 flex items-center justify-between text-sm text-white/55">
          <span>Товары</span>
          <span>{cartCount}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>В общем</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        {cartCount === 0 ? (
          <div className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gray-600 px-5 py-4 text-base font-semibold text-gray-300 cursor-not-allowed">
            Оплатить
          </div>
        ) : (
          <a
            href={checkoutLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-base font-semibold text-black"
          >
            Оплатить
          </a>
        )}
      </div>
    </div>
  );

  const renderSupportPage = () => (
    <div className="flex min-h-full items-center px-4 pb-40 pt-8">
      <div className="w-full rounded-[36px] border border-white/10 bg-white/[0.08] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
        <div className="mb-4 text-6xl">✈️</div>
        <h2 className="mb-2 text-[30px] font-semibold tracking-tight">Поддержка</h2>
        <div className="mx-auto mb-3 max-w-xs text-center text-sm text-white/70">
          По вопросам насчет сайта или же покупок:
        </div>

        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-base font-semibold text-black shadow-lg"
        >
          Написать
        </a>

        <div className="mt-3 text-xs text-white/45">ответим как можно скорее, спасибо!</div>
      </div>
    </div>
  );

  const renderBottomNavigation = () => (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-2">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.12] p-2 backdrop-blur-[24px] shadow-[0_18px_44px_rgba(0,0,0,0.32)]">
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-white/82">
          {navItems.map((item) => {
            const isActive =
              (item.key === "market" && (page === "market" || page === "category")) ||
              page === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  if (item.key === "market") {
                    setPage("market");
                    return;
                  }
                  setPage(item.key);
                }}
                className={`rounded-[24px] px-2 py-2.5 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-[0_10px_24px_rgba(255,255,255,0.28)]"
                    : "bg-transparent text-white/78 hover:bg-white/5"
                }`}
              >
                <div className="mb-1 text-lg leading-none">{item.icon}</div>
                <div className="font-medium">
                  {item.label}
                  {item.key === "cart" && cartCount ? ` (${cartCount})` : ""}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="mx-auto h-full w-full max-w-[430px] bg-black md:flex md:items-center md:justify-center">
        <div className="relative h-full w-full overflow-hidden bg-black md:h-[932px] md:max-h-[932px]">
          <div className="h-full overflow-y-auto overscroll-none">
            {renderHeader()}
            {page === "market" && renderMarketPage()}
            {page === "category" && renderCategoryPage()}
            {page === "cart" && renderCartPage()}
            {page === "support" && renderSupportPage()}
          </div>

          {renderBottomNavigation()}
        </div>
      </div>
    </div>
  );
}

export const __testables = {
  formatPrice,
  getItemWord,
  initialProducts
};

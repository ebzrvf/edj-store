import { useMemo, useState } from "react";

const initialProducts = [
  {
    id: "hoodie-1",
    category: "Худи",
    title: "Balenciaga",
    price: 285000,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    description: "Плотное худи Balenciaga из мягкого хлопка."
  },
  {
    id: "tee-1",
    category: "Футболки",
    title: "Loro Piana",
    price: 330000,
    badge: "Basic",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Базовая футболка на каждый день."
  },
  {
    id: "shorts-1",
    category: "Шорты",
    title: "LV Шорты (Louis Vuitton)",
    price: 478000,
    badge: "Drop",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9d6a5b30e7b?auto=format&fit=crop&w=900&q=80",
    description: "Минималистический дизайн."
  },
  {
    id: "shoes-1",
    category: "Обувь",
    title: "Nike Jordan Air Force 1 (Limited Edition)",
    price: 736000,
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Повседневные кроссовки в уличном стиле."
  },
  {
    id: "accessory-1",
    category: "Аксессуары",
    title: "Urban Cap",
    price: 149000,
    badge: "Style",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
    description: "Кепка с минималистичным дизайном."
  }
];

const categoryMeta = {
  Худи: {
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80"
  },
  Футболки: {
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  },
  Шорты: {
    image:
      "https://images.unsplash.com/photo-1506629905607-d9d6a5b30e7b?auto=format&fit=crop&w=900&q=80"
  },
  Обувь: {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  Аксессуары: {
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80"
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
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);

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
        return { ...product, quantity: entry.quantity };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { productId: product.id, quantity: 1 }];
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

        <div className="text-base font-semibold tracking-wide">EDJ Store</div>
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

  const renderProductCard = (item) => (
    <div
      key={item.id}
      className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
    >
      <div className="aspect-[16/12] overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-black">
          {item.badge}
        </div>
        <div className="mb-1 text-lg font-semibold">{item.title}</div>
        <div className="mb-2 text-sm text-white/55">{item.category}</div>
        <div className="mb-4 text-sm text-white/70">{item.description}</div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold">{formatPrice(item.price)}</div>
          <button
            type="button"
            onClick={() => addToCart(item)}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition active:scale-[0.98]"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );

  const renderMarketPage = () => (
    <div className="px-4 pb-40 pt-4">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">Каталог</h2>
            <p className="text-sm text-white/55">Разделы: </p>
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
          selectedProducts.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08]"
            >
              <div className="aspect-[16/12] overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
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
          ))
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
    <div className="min-h-screen bg-black p-4 text-white sm:p-6">
      <div className="mx-auto flex min-h-[100dvh] items-center justify-center">
        <div className="relative w-full max-w-[430px] overflow-hidden rounded-[44px] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.48)] md:h-[932px] md:max-h-[932px]">
          <div className="h-[100dvh] overflow-y-auto md:h-[932px]">
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

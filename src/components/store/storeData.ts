import { Product, Skin } from "./storeTypes";

export const products: Product[] = [
  {
    id: "team-registration",
    name: "Регистрация команды",
    price: 149,
    description: "Официальная регистрация вашей команды в системе",
    features: [
      "Официальный статус команды",
      "Участие в рейтинговых матчах",
      "Логотип команды",
      "Статистика команды",
      "Приоритетный поиск соперников",
    ],
    icon: "Users",
  },
  {
    id: "premium",
    name: "Премиум",
    price: 199,
    description: "Расширенные возможности для игроков",
    features: [
      "Приоритетная поддержка",
      "Эксклюзивные скины",
      "Дополнительная статистика",
      "Без рекламы",
      "Ранний доступ к обновлениям",
      "Премиум значок",
    ],
    icon: "Crown",
    popular: true,
  },
  {
    id: "tournament",
    name: "Подписка на турниры",
    price: 499,
    description: "Доступ к участию в турнирах с призовыми",
    features: [
      "Участие во всех турнирах",
      "Денежные призы",
      "Эксклюзивные трофеи",
      "Турнирная статистика",
      "Профессиональные матчи",
      "Прямые трансляции",
    ],
    icon: "Trophy",
  },
];

export const skins: Skin[] = [
  // AK-47 скины
  {
    id: "ak47-redline",
    name: "AK-47 | Redline",
    price: 250,
    description: "Field-Tested | Классический красный дизайн",
    image: "/img/8d8eb6c9-e8d6-4748-8556-60537218c063.jpg",
    rarity: "rare",
  },
  {
    id: "ak47-fire-serpent",
    name: "AK-47 | Fire Serpent",
    price: 8500,
    description: "Field-Tested | Огненный змей - легендарный скин",
    image: "/img/6dd665af-3d15-4b6c-ba53-3250cc19349b.jpg",
    rarity: "legendary",
  },
  {
    id: "ak47-hydroponic",
    name: "AK-47 | Hydroponic",
    price: 1200,
    description: "Minimal Wear | Зелёные листья с ярким дизайном",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh3szLYyRR6eO7kYSCgfTLP7LWnn8fvJYpiL6Vpd6h0Qfh-UVqMT3xLNSRcAE4ZwqB_FntyevrjJK7vMudpyNg6HMl7WGdwUJk0ux-SA",
    rarity: "epic",
  },
  {
    id: "ak47-bloodsport",
    name: "AK-47 | Bloodsport",
    price: 400,
    description: "Field-Tested | Кровавый спорт с уникальным паттерном",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh3szacDR9-92zkYyCgfTLP7LWnn8fv8Yk3O2Qo9ik0VG1qUdpNmDwJIWVdlc_ZgqGqAW9yO68jMLu75ybpiFnuyMq4nnbgVXp1lFR_cIn",
    rarity: "epic",
  },
  {
    id: "ak47-vulcan",
    name: "AK-47 | Vulcan",
    price: 800,
    description: "Field-Tested | Металлический блеск с чёрными вставками",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh3szddSRt6eOlnI-Zg8j4OrzZgiVXscQmjL-VrNyk3wPt-kFtMWzycISSewdvNFnTqAXrye68hZPpuJybpDaFNg",
    rarity: "epic",
  },

  // M4A4 скины
  {
    id: "m4a4-howl",
    name: "M4A4 | Howl",
    price: 12000,
    description: "Field-Tested | Легендарный запрещённый скин",
    image: "/img/4ee799f4-7fcb-4bc5-8d31-54fde420172d.jpg",
    rarity: "legendary",
  },
  {
    id: "m4a4-asiimov",
    name: "M4A4 | Asiimov",
    price: 650,
    description: "Field-Tested | Бело-оранжевый футуристический дизайн",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alDLPOhm5d18d4jeHVu92m0A23qkVoMGGgIdSSdAY5Zw2DqAftxevqjcC1ot2XnoEE7Kw",
    rarity: "epic",
  },
  {
    id: "m4a4-dragon-king",
    name: "M4A4 | Dragon King",
    price: 180,
    description: "Minimal Wear | Китайский дракон с золотыми деталями",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFYzVF4uO0mZWPkuTLP7LWnn9u5Mx2gv2Po4_ziwflqUNoMWugJoLAcFI-Y13Zr1C9xuu7jMS_vsmYwSNjvCEk5y2MmhG0n1gSOfiGCZbI",
    rarity: "rare",
  },
  {
    id: "m4a4-neo-noir",
    name: "M4A4 | Neo-Noir",
    price: 320,
    description: "Field-Tested | Чёрно-белый стиль ноар",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszfcDRK4uO0mZSOhcj5Nr_Yg2Zu4cZOhuDG_Zi7jge2rhZuYGynJNWSdAY9YVyE_Vm4kO65hpG8vJ3Nn3Ow7CI8pSGKk1CDnAQ",
    rarity: "rare",
  },
  {
    id: "m4a4-bullet-rain",
    name: "M4A4 | Bullet Rain",
    price: 90,
    description: "Minimal Wear | Камуфляж с пулями и кровью",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFYzRt6eOxh7-Gw_alDLfUhGRu5Mx2gv2Po4-n31Hs-UNvZzqnJtPBe1JtNFyGr1m7yerr15_pv5XBwSQwvD5iuyivqoOzn1gSOggZKJIm",
    rarity: "common",
  },

  // AWP скины
  {
    id: "awp-dragon-lore",
    name: "AWP | Dragon Lore",
    price: 15000,
    description: "Field-Tested | Легендарный дракон - мечта каждого снайпера",
    image: "/img/b4b8810f-e009-49e2-92cf-99c7e1c5e154.jpg",
    rarity: "legendary",
  },
  {
    id: "awp-asiimov",
    name: "AWP | Asiimov",
    price: 950,
    description: "Field-Tested | Классический бело-оранжевый Asiimov",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2m5u5Mx2gv2PoNmm2VLhqEFsMWGldoKcJgBsNF3S-wO6ku-6hZHvuJTMyHUyvCFz52-PyhWwn1gSOqmnOPuT",
    rarity: "epic",
  },
  {
    id: "awp-hyper-beast",
    name: "AWP | Hyper Beast",
    price: 420,
    description: "Field-Tested | Яркий монстр в неоновых цветах",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PXJZTVR09u5mpSOhcj4OrzZgiVXvpwhib3A8NWh2wDs_UNlMW-gcY_Dd1Q-MlGF8w6gxOe61J656J_KnSZFsGE",
    rarity: "epic",
  },
  {
    id: "awp-lightning-strike",
    name: "AWP | Lightning Strike",
    price: 380,
    description: "Factory New | Молния на чёрном фоне",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2m4F7JwhiuzA45W7jVex8kNtYTv0dYSXdFI_aF2C-VnowLu915G17pjKm3UwuSJ04X3UlwKw",
    rarity: "rare",
  },
  {
    id: "awp-redline",
    name: "AWP | Redline",
    price: 180,
    description: "Field-Tested | Красные линии на чёрном фоне",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7c2m8DvZFy0-yU8I2g2lHjrkppZGH6cNCQJwZvaA6F-AK6w-vpmJbvuJrPwCJrsiYk5n7blxG-gkgaOLJrnOSACQLJbTu_xQ",
    rarity: "rare",
  },

  // Пистолеты
  {
    id: "glock-fade",
    name: "Glock-18 | Fade",
    price: 1800,
    description: "Factory New | Легендарный градиент",
    image: "/img/84398824-bc3e-481b-b276-143ae03bc86f.jpg",
    rarity: "legendary",
  },
  {
    id: "deagle-blaze",
    name: "Desert Eagle | Blaze",
    price: 3200,
    description: "Factory New | Огненный дизайн на Desert Eagle",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjxD_t24zYaOqPP7Ia_Qmlm8_sZlmOzA-LP5gVO8vywrfWnyJoOUJAc2Z1mDqQS3xu3oh5C1vJzPyyBkuyAi43vZnxHln1gSOq5wVpOE",
    rarity: "legendary",
  },
  {
    id: "usp-kill-confirmed",
    name: "USP-S | Kill Confirmed",
    price: 650,
    description: "Minimal Wear | Чёрно-красный камуфляж с черепами",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-1mY-0mf7zOq7c2m5u5shwjrDAptqsjgHs8hJqNzj1doHAdAI7NQ2E_AK8xu3sh8ftv5-cmCBrvSV05n7YlxGzihlNOOdj0_SJJCca",
    rarity: "epic",
  },
  {
    id: "five-seven-monkey-business",
    name: "Five-SeveN | Monkey Business",
    price: 120,
    description: "Field-Tested | Весёлые обезьянки на пистолете",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLOzLhRlxfbGTjxP_t2knZaKhfHxOrLdn2xZ_It43L-TrNyk0VCx_BY5MDzxJdOQcVQ3ZlvV_AO_lbzsg5ftu5-cziY1vSN0tivfmRTm",
    rarity: "common",
  },

  // Ножи
  {
    id: "karambit-fade",
    name: "Karambit | Fade",
    price: 18000,
    description: "Factory New | Легендарный карамбит с градиентом",
    image: "/img/4e5ed87a-e306-4765-8089-2cfd9fdd2dab.jpg",
    rarity: "legendary",
  },
  {
    id: "butterfly-crimson-web",
    name: "Butterfly | Crimson Web",
    price: 9500,
    description: "Minimal Wear | Красная паутина на ноже-бабочке",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tOtkYaKjfv7NqvFmlm9_sZlmOzA-LP5gVO8vywrfGH1JYCWd1U7Z1vZrFS2w-zu1pfuv5WanzJkuSMht3fbzUeym1gSOhgUClp_",
    rarity: "legendary",
  },
  {
    id: "m9-doppler",
    name: "M9 Bayonet | Doppler",
    price: 4500,
    description: "Factory New | Фазовые переливы на классическом ноже",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-DjsjwN6vdqWZU7Mxkh6fA_Jn4xlWy-hc5MGHwdtXAJlU9aQmE8gS5w-i915K5upjOziBlvCB14H6LnkO0hk9PbOc_1uuIEhrJVxdRVObC",
    rarity: "legendary",
  },
  {
    id: "huntsman-case-hardened",
    name: "Huntsman | Case Hardened",
    price: 850,
    description: "Well-Worn | Синие пятна на закалённом металле",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTj5H5dukq5WKqPv9NLPF2G5u5Mx2gv2Po4_23gew8kE-amygJdPDewE2Z1DZqQW7wbju1JO7vJjNyiRnvyYl5WGdwUIR4u6iSg",
    rarity: "epic",
  },
  {
    id: "flip-ultraviolet",
    name: "Flip Knife | Ultraviolet",
    price: 320,
    description: "Field-Tested | Ультрафиолетовый оттенок",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tOxnYyCk_7zOq_UhFm4ycZFsNWi2drG8QPn-ktlam30ctCTdAQ3aQ2B-APqlebshJG6u5vLm3AwvCNw7CqJy0O0gktEZuFo0qCbBgeJU4HdLw",
    rarity: "rare",
  },

  // Пулемёты
  {
    id: "m249-nebula-crusader",
    name: "M249 | Nebula Crusader",
    price: 180,
    description: "Field-Tested | Космический крестоносец",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhzw8zFdC5K09mhkIWKhfz3NLPdqWZU7Mxkh6fH_Jn4xlG28kFqNmD6I4eRJ1dtZ1qEqFK_xurpgJG1ucnAmyFluCZ04XuMm0O0gktKL7ByhaTJUBGJVF0XUP_SVUY",
    rarity: "rare",
  },
  {
    id: "negev-power-loader",
    name: "Negev | Power Loader",
    price: 95,
    description: "Battle-Scarred | Мощный погрузчик",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouL-iLhFf1ObcTz5X7dO5kb-HnvD8J_eLxD5SvMQmj7qSpN2s3lbj-hZsNm3wIYSVdlI_ZAzW-AK4xOfr18Lvv5ydz3Y2viZ2sSuJzEWw1gYMMLJa26E0Ukg",
    rarity: "common",
  },

  // Другие ружья
  {
    id: "p90-asiimov",
    name: "P90 | Asiimov",
    price: 280,
    description: "Field-Tested | Футуристический дизайн",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FAR17PLfYQJD_9W7m5a0mvLwOq7c2m5u5Mx2gv2P8I2m3gTkqEs5N26nItTGJlI_Zl3SqVe7w-3rhpO9u53NyiNr6HQm5C7YyRew",
    rarity: "rare",
  },
  {
    id: "galil-cerberus",
    name: "Galil AR | Cerberus",
    price: 450,
    description: "Field-Tested | Трёхглавый пёс ада",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJF7dC_mpSOlcj5Nr_Yg2Zu5Mx2gv2Po4in2A23-0dpY2uhcYDAcwNqNF6Crla8x-nohsK5u8jJynNjvD5iuygtTFXpRw",
    rarity: "epic",
  },
  {
    id: "famas-roll-cage",
    name: "FAMAS | Roll Cage",
    price: 65,
    description: "Field-Tested | Металлическая решётка",
    image:
      "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7umeldf0v33fzxH_uO1gb-GwdSn077fhm5D18R_jOXH8IXzigew-hA5Zmj6ddWVe1I6Zl7T_1fugK2-m9bi67NTNVjA",
    rarity: "common",
  },
];
/** Site navigation (mirrors the WordPress menu, minus the shop). */

export type MenuLink = { label: string; href: string; note?: string };
export type MenuGroup = { title?: string; links: MenuLink[]; wide?: boolean };
export type MenuItem =
  | { label: string; href: string; urgent?: boolean }
  | { label: string; groups: MenuGroup[]; layout: "two" | "food" | "one" };

const food = (name: string, slug = name.toLowerCase()) => ({
  label: name,
  href: `/can-rabbits-eat-${slug}/`,
});

export const MENU: MenuItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Care Guides",
    layout: "two",
    groups: [
      {
        links: [
          { label: "New rabbit owner information", href: "/new-rabbit-owner-information/", note: "Beginner setup and first-rabbit basics" },
          { label: "Rabbit housing size", href: "/how-big-should-a-rabbits-cage-be/", note: "Space, exercise areas and safe setup" },
          { label: "Best bedding for rabbits", href: "/best-bedding-for-rabbits/", note: "Safe, clean and comfortable bedding" },
          { label: "Rabbit toys", href: "/rabbit-toys/", note: "Enrichment, chew toys and play ideas" },
          { label: "Rabbit behaviour", href: "/rabbit-behaviour/", note: "Body language, binkies and thumping" },
          { label: "Rabbit health", href: "/rabbit-health/", note: "Healthy signs and urgent warning signs" },
        ],
      },
    ],
  },
  {
    label: "Food Guides",
    layout: "food",
    groups: [
      {
        title: "Start here",
        links: [
          { label: "What do rabbits eat?", href: "/what-do-rabbits-eat/", note: "Hay, greens, pellets and treats" },
          { label: "Best hay for rabbits", href: "/best-hay-for-rabbits/", note: "Timothy, meadow and orchard hay" },
          { label: "Can rabbits eat this?", href: "/can-rabbits-eat-this/", note: "Search the food checker" },
        ],
      },
      {
        title: "Vegetables",
        links: [food("Carrots"), food("Celery"), food("Cucumber"), food("Lettuce"), food("Peppers"), food("Tomatoes")],
      },
      {
        title: "Fruit",
        wide: true,
        links: [
          food("Apples"),
          food("Bananas"),
          food("Blackberries"),
          food("Blueberries"),
          food("Cantaloupe", "cantaloupe-melons"),
          food("Cherries"),
          food("Cranberries"),
          food("Gooseberries"),
          food("Grapes"),
          food("Honeydew", "honeydew-melon"),
          food("Kiwi"),
          food("Mangos"),
          food("Mulberries"),
          food("Nectarines"),
          food("Peaches"),
          food("Pears"),
          food("Pineapple"),
          food("Plums"),
          food("Raspberries"),
          food("Strawberries"),
          food("Watermelon"),
        ],
      },
    ],
  },
  { label: "Can Rabbits Eat This?", href: "/can-rabbits-eat-this/" },
  { label: "Learn More", href: "/learn-more/" },
  {
    label: "About",
    layout: "one",
    groups: [
      {
        links: [
          { label: "About the author", href: "/author/", note: "Meet Natasha and how the guides are written" },
          { label: "Contact us", href: "/contact-us/", note: "Questions, suggestions and feedback" },
          { label: "Privacy policy & cookies", href: "/privacy-policy/", note: "Privacy, cookies and site information" },
        ],
      },
    ],
  },
  { label: "Urgent signs", href: "/rabbit-health/", urgent: true },
];

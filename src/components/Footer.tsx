import Icon from "@/components/ui/icon";

interface FooterSection {
  title: string;
  links: Array<{
    name: string;
    href: string;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: "Турниры",
    links: [
      { name: "Текущие турниры", href: "#" },
      { name: "Расписание", href: "#" },
      { name: "Архив", href: "#" },
    ],
  },
  {
    title: "Сообщество",
    links: [
      { name: "Рейтинги", href: "#" },
      { name: "Форум", href: "#" },
      { name: "Discord", href: "#" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { name: "Правила", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Контакты", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: "MessageCircle", href: "#" },
  { icon: "Youtube", href: "#" },
  { icon: "Twitter", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/img/a6ee8f4d-26f5-4ec3-ada3-dfa630021d75.jpg"
                alt="CS2 Tournament"
                className="h-8 w-8 rounded"
              />
              <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                CS2 ARENA
              </h4>
            </div>
            <p className="text-zinc-400">
              Профессиональная киберспортивная платформа для турниров по CS2
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h5 className="text-white font-semibold mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-400 text-sm">
            © 2024 CS2 ARENA. Все права защищены.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name={social.icon as any} size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

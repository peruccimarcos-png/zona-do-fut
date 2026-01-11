import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, Facebook, Instagram, Twitter, Youtube, Heart } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: "Notícias", href: "/noticias" },
    { label: "Jogos de Hoje", href: "/jogos-de-hoje" },
    { label: "Mercado da Bola", href: "/mercado" },
    { label: "Melhores Casas", href: "/apostas" },
    { label: "Times", href: "/times" },
    { label: "Brasileirão", href: "/brasileirao" },
    { label: "Champions", href: "/champions" },
    { label: "Mundo", href: "/mundo" },
    { label: "Meu Perfil", href: "/perfil", icon: Heart },
  ];

  // Adicionar link do Admin se usuário estiver autenticado
  const allNavItems = isAuthenticated 
    ? [...navItems, { label: "Admin", href: "/admin" }]
    : navItems;

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      {/* Topo Fixo */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            
            <Link href="/">
              <a className="flex items-center gap-2 font-display font-bold text-2xl tracking-tighter hover:opacity-90 transition-opacity">
                <span className="text-primary">ZONA</span>
                <span className="text-accent">DO FUT</span>
                <span className="text-accent">⚡</span>
              </a>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {allNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`transition-colors hover:text-accent flex items-center gap-1 ${location === item.href ? "text-accent" : "text-foreground/80"}`}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Busca e Redes Sociais */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
            <div className="relative hidden sm:block w-full max-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full bg-muted pl-8 h-9 rounded-sm border-none focus-visible:ring-1 focus-visible:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border p-4 bg-background animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-4">
              {allNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className="text-lg font-medium hover:text-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                <a href="#" className="text-foreground/60 hover:text-accent"><Instagram className="h-6 w-6" /></a>
                <a href="#" className="text-foreground/60 hover:text-accent"><Twitter className="h-6 w-6" /></a>
                <a href="#" className="text-foreground/60 hover:text-accent"><Facebook className="h-6 w-6" /></a>
                <a href="#" className="text-foreground/60 hover:text-accent"><Youtube className="h-6 w-6" /></a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="border-t border-border bg-muted/50">
        <div className="container py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl">
                <span className="text-primary">ZONA</span>
                <span className="text-accent">DO FUT</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Futebol sem enrolação. Notícias rápidas, resultados e tudo o que acontece no mundo da bola.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/brasileirao"><a className="hover:text-accent">Brasileirão</a></Link></li>
                <li><Link href="/mercado"><a className="hover:text-accent">Mercado da Bola</a></Link></li>
                <li><Link href="/champions"><a className="hover:text-accent">Champions League</a></Link></li>
                <li><Link href="/mundo"><a className="hover:text-accent">Futebol Internacional</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacidade"><a className="hover:text-accent">Política de Privacidade</a></Link></li>
                <li><Link href="/termos"><a className="hover:text-accent">Termos de Uso</a></Link></li>
                <li><Link href="/contato"><a className="hover:text-accent">Trabalhe Conosco</a></Link></li>
                <li><Link href="/anuncie"><a className="hover:text-accent">Anuncie</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Siga-nos</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zona do Fut. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

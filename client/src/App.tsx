import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Páginas
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import Market from "./pages/Market";
import Category from "./pages/Category";
import MatchDetail from "./pages/MatchDetail";
import BettingRanking from "./pages/BettingRanking";
import Profile from "./pages/Profile";
import TodayMatches from "./pages/TodayMatches";
import Admin from "./pages/Admin";
import ArticleEditor from "./pages/ArticleEditor";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/noticia/:slug" component={NewsDetail} />
      <Route path="/jogo/:id" component={MatchDetail} />
      <Route path="/jogos-de-hoje" component={TodayMatches} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/novo-artigo" component={ArticleEditor} />
      <Route path="/admin/editar/:id" component={ArticleEditor} />
      <Route path={"/apostas"} component={BettingRanking} />
      <Route path={"/perfil"} component={Profile} />      <Route path="/mercado" component={Market} />
      
      {/* Rotas de Categoria Genéricas */}
      <Route path="/noticias" component={() => <Category />} />
      <Route path="/times" component={() => <Category />} />
      <Route path="/brasileirao" component={() => <Category />} />
      <Route path="/champions" component={() => <Category />} />
      <Route path="/mundo" component={() => <Category />} />
      
      {/* Rota dinâmica para qualquer outra categoria */}
      <Route path="/categoria/:category" component={Category} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

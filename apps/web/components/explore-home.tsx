'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpRight, PanelsTopLeft, Search } from 'lucide-react';
import { ProjectBrand } from './project-header';
import { links } from '../landing/site';
import Chat from './chat';
import { warm } from '../lib/pii';
import './explore-home.css';

const organizations = [
  { name: 'Administración', image: 'gobierno.svg' },
  { name: 'Empleo', image: 'sepe.svg' },
  { name: 'Tráfico', image: 'dgt.svg' },
  { name: 'Normativa', image: 'boe.svg' },
  { name: 'Identidad digital', image: 'clave.png' },
  { name: 'Tu comunidad', image: 'comunidades/andalucia.png' },
];
const communities = [
  'andalucia.png',
  'catalunya.svg',
  'galicia.svg',
  'madrid.svg',
  'aragon.svg',
  'valencia.png',
];

export default function ExploreHome({ mode }: { mode: 'preview' | 'live' }) {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<string | null>(null);
  const [chatKey, setChatKey] = useState(0);
  const input = useRef<HTMLTextAreaElement>(null);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (query.trim().length < 4) return;
    setConversation(query.trim());
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (conversation !== null) {
    return (
      <Chat
        key={chatKey}
        initialQuestion={conversation}
        onGoHome={() => {
          setConversation(null);
          setQuery('');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onNewConversation={() => {
          setConversation('');
          setChatKey((value) => value + 1);
        }}
      />
    );
  }

  return (
    <div className="explore-home">
      <header className="explore-header">
        <Link href="/explorar" className="explore-brand">
          <ProjectBrand />
        </Link>
        <a href={links.repo}>
          Un proyecto abierto <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </header>
      <main id="main" className="explore-main">
        <section className="explore-intro" aria-labelledby="explore-title">
          <h1 id="explore-title">
            La Administración es de todos.
            <br />
            <span>Que sea fácil de usar, también.</span>
          </h1>
          <p>
            Reforma Digital es una iniciativa abierta para mejorar nuestra relación con lo público.
            Creamos herramientas para entender los trámites y hacer más sencillas las webs donde los
            resuelves.
          </p>
        </section>

        <section className="explore-services" aria-label="Nuestras herramientas">
          <a
            href="#buscador"
            className="explore-service"
            onClick={() => input.current?.focus({ preventScroll: true })}
          >
            <span className="explore-service-icon">
              <Search size={23} strokeWidth={1.5} />
            </span>
            <div>
              <h2>
                Encuentra el camino <ArrowDown size={17} aria-hidden="true" />
              </h2>
              <p>Cuéntanos qué necesitas. Encuentra la web oficial y los pasos para empezar.</p>
              <span className="explore-service-link">Buscador de trámites</span>
            </div>
          </a>
          <a href={links.install} className="explore-service">
            <span className="explore-service-icon explore-service-icon-extension">
              <PanelsTopLeft size={23} strokeWidth={1.5} />
            </span>
            <div>
              <h2>
                Una web más fácil <ArrowUpRight size={17} aria-hidden="true" />
              </h2>
              <p>Una extensión que simplifica las webs públicas, sin salir del sitio oficial.</p>
              <span className="explore-service-link">
                Extensión para tu navegador <small>Pre-alpha</small>
              </span>
            </div>
          </a>
        </section>

        <section id="buscador" className="explore-search" aria-labelledby="explore-search-title">
          <div className="explore-search-heading">
            <h2 id="explore-search-title">Tú dinos qué necesitas.</h2>
            <span>Nosotros buscamos por dónde empezar.</span>
          </div>
          <form className="explore-composer" onSubmit={submit}>
            <textarea
              ref={input}
              aria-label="¿Qué necesitas hacer?"
              placeholder="Por ejemplo, ¿cómo me doy de alta como autónomo?"
              value={query}
              onChange={(event) => {
                warm();
                setQuery(event.target.value);
              }}
              maxLength={1200}
              rows={2}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit();
                }
              }}
            />
            <button type="submit" aria-label="Buscar mi trámite" disabled={query.trim().length < 4}>
              <ArrowUp size={20} />
            </button>
          </form>
          {mode === 'preview' && (
            <p className="explore-preview">
              Vista previa con fragmentos oficiales; la generación con IA no está activada.
            </p>
          )}
          <div className="explore-organizations" aria-label="Ámbitos de la Administración">
            {organizations.map((organization) => (
              <div className="explore-organization" key={organization.name}>
                <div className="explore-organization-art">
                  {organization.name === 'Tu comunidad' ? (
                    <div className="explore-community-logos" aria-hidden="true">
                      {communities.map((image) => (
                        <img key={image} src={`/organismos/comunidades/${image}`} alt="" />
                      ))}
                    </div>
                  ) : (
                    <img src={`/organismos/${organization.image}`} alt="" />
                  )}
                </div>
                <span>{organization.name}</span>
              </div>
            ))}
          </div>
          <p className="explore-evidence">
            Las respuestas se apoyan en <Link href="/sources">fuentes oficiales</Link>. La cobertura
            se amplía poco a poco.
          </p>
        </section>
      </main>
      <footer className="explore-footer">
        <p>Independiente de la Administración. Abierto a todo el mundo.</p>
        <a href={links.contributing}>
          Construyámoslo juntos <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}

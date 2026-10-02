'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { warm } from '../lib/pii';

export default function HeroComposer({ onAsk }: { onAsk: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const ready = query.trim().length >= 4;
  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!ready) return;
    onAsk(query.trim());
  }
  return (
    <form className="hero-composer" id="buscador" onSubmit={submit}>
      <label htmlFor="question" className="sr-only">
        Pregunta sobre trámites
      </label>
      <textarea
        id="question"
        rows={2}
        value={query}
        onChange={(event) => {
          warm();
          setQuery(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Escribe qué trámite necesitas"
        maxLength={1200}
        autoComplete="off"
        enterKeyHint="send"
      />
      <button type="submit" disabled={!ready} aria-label="Preguntar">
        <ArrowUp size={18} />
      </button>
    </form>
  );
}

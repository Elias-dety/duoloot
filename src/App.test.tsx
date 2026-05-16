import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    // Renderiza a aplicação inteira (que contém o RouterProvider)
    render(<App />);
    
    // Verifica se algum elemento foi renderizado no body
    expect(document.body).toBeInTheDocument();
  });
});

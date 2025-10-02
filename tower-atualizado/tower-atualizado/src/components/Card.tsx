import React from "react";

// Tipagem para as propriedades (props) dos componentes
interface CardProps {
  className?: string; // Classe opcional que o usuário pode passar
  children: React.ReactNode;
  [key: string]: any; // Permite passar outras props (como onClick, id, etc.)
}

/**
 * Componente de Card
 * Aplica estilos de borda, sombra e padding padrão.
 */
// **Todas as vírgulas estão no lugar aqui**
export function Card({ className, children, ...props }: CardProps) {
  // 1. Classes base (Tailwind)
  const classes = [
    "rounded-2xl",
    "border",
    "border-gray-700",
    "bg-gray-800", // Cor de fundo do Card
    "p-4",
    "shadow-md",
  ];

  // 2. Adiciona a classe extra passada pelo usuário
  if (className) {
    classes.push(className);
  }

  return (
    // 3. Junta todas as classes em uma string
    <div className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

// ---

/**
 * Componente para o conteúdo interno do Card
 * Aplica padding menor e estilos de texto.
 */
export function CardContent({ className, children, ...props }: CardProps) {
  // 1. Classes base (Tailwind)
  const classes = ["p-2", "text-sm", "text-gray-200"];

  // 2. Adiciona a classe extra passada pelo usuário
  if (className) {
    classes.push(className);
  }

  return (
    // 3. Junta todas as classes em uma string
    <div className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}
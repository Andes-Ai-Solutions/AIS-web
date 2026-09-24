// Textos y datos de la landing. Editar aquí para cambiar contenido sin tocar el diseño.

export const site = {
  name: 'AndesAiSolutions',
  title: 'AndesAiSolutions | Software e IA a la medida para pymes',
  description:
    'Desarrollo de software a la medida y soluciones con IA para pymes. Diagnóstico gratis de 30 minutos, sin compromiso.',
  email: 'andesai.solutions@gmail.com',
  whatsapp: '573046123335',
  linkedin: 'https://www.linkedin.com/company/146630745',
  location: 'Manizales, Colombia',
};

/** Enlace a WhatsApp con el mensaje ya escrito. */
export const whatsappLink = (message: string): string =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

/** Botón principal "Diagnóstico gratis" (header y hero). */
export const diagnosticoWhatsapp = whatsappLink(
  'Hola, quiero agendar mi diagnóstico gratis de 30 minutos para conocer cómo puedo mejorar mi negocio con software o IA.',
);

export const navLinks = [
  { href: '#problemas', label: 'Problemas' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Cómo trabajo' },
  { href: '#quien-soy', label: 'Quién soy' },
];

export interface Item {
  icon: string;
  title: string;
  description: string;
}

export const problems: Item[] = [
  {
    icon: 'heroicons:table-cells',
    title: 'Hojas de Excel por todos lados',
    description: 'Versiones duplicadas, fórmulas rotas y nadie sabe cuál es el archivo correcto.',
  },
  {
    icon: 'heroicons:chat-bubble-left-right',
    title: 'Pedidos perdidos en el chat',
    description:
      'Clientes que escriben por WhatsApp y la información se pierde entre cientos de mensajes.',
  },
  {
    icon: 'heroicons:clock',
    title: 'Horas en tareas repetitivas',
    description: 'Copiar datos, armar reportes a mano y hacer lo mismo todos los días.',
  },
  {
    icon: 'heroicons:question-mark-circle',
    title: 'Decisiones a ciegas',
    description: 'No sabes con claridad cuánto vendes, qué se mueve o dónde se va el dinero.',
  },
];

export const services: Item[] = [
  {
    icon: 'heroicons:device-phone-mobile',
    title: 'Apps web y móviles a la medida',
    description:
      'Aplicaciones diseñadas para tus procesos, no al revés. Para tu equipo o para tus clientes.',
  },
  {
    icon: 'heroicons:squares-2x2',
    title: 'Sistemas de gestión',
    description:
      'Inventario, ventas, clientes y operación en un solo lugar, accesible desde cualquier dispositivo.',
  },
  {
    icon: 'heroicons:sparkles',
    title: 'Automatización con IA',
    description:
      'Deja que la inteligencia artificial haga el trabajo repetitivo: respuestas, clasificación, documentos y más.',
  },
  {
    icon: 'heroicons:chart-bar',
    title: 'Bases de datos y reportes',
    description:
      'Tu información ordenada y segura, con reportes claros para tomar mejores decisiones.',
  },
];

export interface Need extends Item {
  message: string;
}

// Sección "¿Qué necesitas?": cada opción abre WhatsApp con su propio mensaje.
export const needs: Need[] = [
  {
    icon: 'heroicons:globe-alt',
    title: 'Desarrollo web',
    description: 'Aplicaciones y plataformas web a la medida de tu negocio.',
    message:
      'Hola, vi tu página y me interesa una aplicación web a la medida para mi negocio. ¿Podemos agendar el diagnóstico gratis de 30 minutos?',
  },
  {
    icon: 'heroicons:device-phone-mobile',
    title: 'Desarrollo móvil',
    description: 'Apps para Android y iPhone, para tu equipo o tus clientes.',
    message:
      'Hola, me interesa una app móvil para mi negocio. ¿Podemos agendar el diagnóstico gratis de 30 minutos?',
  },
  {
    icon: 'heroicons:cpu-chip',
    title: 'Automatización con IA / chatbots',
    description: 'Chatbots y flujos automáticos que hacen el trabajo repetitivo.',
    message:
      'Hola, quiero automatizar procesos o tener un chatbot para mi negocio. ¿Podemos agendar el diagnóstico gratis de 30 minutos?',
  },
  {
    icon: 'heroicons:squares-2x2',
    title: 'Sistemas de gestión',
    description: 'Inventario, ventas y clientes organizados en un solo lugar.',
    message:
      'Hola, necesito un sistema de gestión (inventario, ventas, clientes) para mi negocio. ¿Podemos agendar el diagnóstico gratis de 30 minutos?',
  },
  {
    icon: 'heroicons:wrench-screwdriver',
    title: 'Mantenimiento y soporte',
    description: 'Arreglo, mejoro o amplío el software que tu negocio ya tiene.',
    message:
      'Hola, ya tengo un software o página en mi negocio y necesito arreglarlo o mejorarlo. ¿Podemos agendar el diagnóstico gratis de 30 minutos?',
  },
];

export const steps = [
  {
    title: 'Diagnóstico gratis',
    description: '30 minutos para entender tu negocio y dónde se está perdiendo tiempo.',
  },
  {
    title: 'Propuesta',
    description: 'Te presento una solución concreta, con alcance, tiempos y costo claros.',
  },
  {
    title: 'Desarrollo por fases',
    description: 'Avances visibles en cada fase para que valides y ajustemos a tiempo.',
  },
  {
    title: 'Entrega',
    description: 'Tu solución funcionando, con capacitación para tu equipo y acompañamiento.',
  },
];

export const techStack = ['Angular', 'TypeScript', '.NET', 'PostgreSQL', 'IA'];

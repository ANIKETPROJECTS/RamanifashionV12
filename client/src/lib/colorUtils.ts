export const colorNameToCss: Record<string, string> = {
  'red': '#dc2626',
  'blue': '#2563eb',
  'green': '#16a34a',
  'pink': '#ec4899',
  'yellow': '#eab308',
  'black': '#000000',
  'white': '#ffffff',
  'purple': '#9333ea',
  'maroon': '#7f1d1d',
  'grey': '#6b7280',
  'gray': '#6b7280',
  'orange': '#ea580c',
  'beige': '#d4a574',
  'cream': '#fffdd0',
  'gold': '#d4af37',
  'silver': '#c0c0c0',
  'brown': '#8b4513',
  'navy': '#1e3a5a',
  'teal': '#0d9488',
  'coral': '#ff7f50',
  'peach': '#ffcba4',
  'mustard': '#e1ad01',
  'olive': '#808000',
  'magenta': '#ff00ff',
  'turquoise': '#40e0d0',
  'lavender': '#e6e6fa',
  'rani pink': '#ff1493',
  'onion pink': '#dda0dd',
  'burgundy': '#800020',
  'wine': '#722f37',
  'rust': '#b7410e',
  'ivory': '#fffff0',
  'off-white': '#faf9f6',
  'charcoal': '#36454f',
  'mint': '#98fb98',
  'salmon': '#fa8072',
  'copper': '#b87333',
  'bronze': '#cd7f32',
  'rose': '#ff007f',
  'fuchsia': '#ff00ff',
  'indigo': '#4b0082',
  'violet': '#8b00ff',
  'plum': '#dda0dd',
  'chocolate': '#7b3f00',
  'tan': '#d2b48c',
  'khaki': '#c3b091',
  'aqua': '#00ffff',
  'cyan': '#00ffff',
  'lime': '#32cd32',
  'chartreuse': '#7fff00',
  'dark green': '#006400',
  'dark blue': '#00008b',
  'dark red': '#8b0000',
  'dark pink': '#c71585',
  'dark purple': '#301934',
  'light blue': '#add8e6',
  'light green': '#90ee90',
  'light pink': '#ffb6c1',
  'sky blue': '#87ceeb',
  'royal blue': '#4169e1',
  'forest green': '#228b22',
  'emerald green': '#50c878',
  'bottle green': '#006a4e',
  'sea green': '#2e8b57',
  'parrot green': '#50c878',
};

export function getColorCssValue(colorName: string): string {
  const lowerColor = colorName.toLowerCase().trim();
  if (colorNameToCss[lowerColor]) return colorNameToCss[lowerColor];
  // Try removing spaces for CSS named colors (e.g., "dark green" → "darkgreen")
  const noSpace = lowerColor.replace(/\s+/g, '');
  if (colorNameToCss[noSpace]) return colorNameToCss[noSpace];
  return lowerColor;
}

export function extractUniqueColorsFromProducts(products: any[]): string[] {
  const colorSet = new Set<string>();

  products.forEach(product => {
    if (product.displayColor) {
      colorSet.add(product.displayColor);
      return;
    }
    if (!product.baseProductId && product.colorVariants && Array.isArray(product.colorVariants)) {
      product.colorVariants.forEach((variant: any) => {
        if (variant.color) {
          colorSet.add(variant.color);
        }
      });
    }
  });

  return Array.from(colorSet).sort();
}

export function extractColorHexMapFromProducts(products: any[]): Record<string, string> {
  const hexMap: Record<string, string> = {};

  products.forEach(product => {
    if (product.displayColor) {
      if (product.displayColorHex && product.displayColorHex.trim()) {
        hexMap[product.displayColor] = product.displayColorHex;
      }
      return;
    }
    if (!product.baseProductId && product.colorVariants && Array.isArray(product.colorVariants)) {
      product.colorVariants.forEach((variant: any) => {
        if (variant.color && variant.colorHex && variant.colorHex.trim()) {
          hexMap[variant.color] = variant.colorHex;
        }
      });
    }
  });

  return hexMap;
}

export function getSwatchColor(colorName: string, hexMap: Record<string, string>): string {
  if (hexMap[colorName] && hexMap[colorName].trim()) return hexMap[colorName];
  return getColorCssValue(colorName);
}

export function getCompositeOperation(blendMode: string): GlobalCompositeOperation {
  switch (blendMode) {
    case 'screen':
      return 'screen';
    case 'color-dodge':
      return 'color-dodge';
    case 'overlay':
      return 'overlay';
    case 'hard-light':
      return 'hard-light';
    case 'soft-light':
      return 'soft-light';
    case 'lighten':
      return 'lighten';
    case 'lighter':
    case 'plus-lighter':
      return 'lighter';
    case 'multiply':
      return 'multiply';
    case 'luminosity':
      return 'luminosity';
    case 'color':
      return 'color';
    default:
      return 'source-over';
  }
}


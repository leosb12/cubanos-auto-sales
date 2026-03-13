const folder = '/2017 GMC terrain'

const imagePath = (name) => encodeURI(`${folder}/${name}`)

export const terrain2017 = {
  id: 1,
  slug: '2017-gmc-terrain-awd-sle',
  model: '2017 GMC Terrain AWD SLE',
  price: '$7,800 Cash',
  miles: '104,700 mi',
  fuel: 'Gasoline',
  drivetrain: 'AWD',
  transmission: 'Automatic',
  engine: 'V6',
  title: 'Rebuilt Title',
  coverImage: imagePath('portada.jpg'),
  gallery: [
    imagePath('portada.jpg'),
    imagePath('delantefrente.jpg'),
    imagePath('delantecostado.jpg'),
    imagePath('delado.jpg'),
    imagePath('otrolado.jpg'),
    imagePath('atras.jpg'),
    imagePath('atras2.jpg'),
    imagePath('atrascostado.jpg'),
    imagePath('interior.jpg'),
    imagePath('interior2.jpg'),
    imagePath('interior3.jpg'),
    imagePath('interioratras.jpg'),
    imagePath('interioratras2.jpg'),
    imagePath('tablero.jpg'),
    imagePath('motor.jpg'),
    imagePath('llantas.jpg'),
    imagePath('maletero.jpg'),
  ],
  highlights: [
    'AWD drivetrain for stronger traction and confident daily driving',
    'Powerful V6 engine with smooth automatic transmission',
    'Bluetooth, integrated navigation, and rear-view camera',
    'Remote start, heated seats, and power sunroof',
    'Clean interior and loaded SLE package with comfort upgrades',
  ],
  description:
    'This 2017 GMC Terrain AWD SLE is a clean, well-equipped SUV that delivers comfort, utility, and strong value in one package. It has 104,700 miles and comes with premium daily-use features including Bluetooth, navigation, rear camera, remote start, heated seats, and sunroof.',
  disclosure:
    'The vehicle carries a rebuilt title due to a previous minor front-left collision. The affected components were replaced with new parts, and the SUV is being sold at a fixed, aggressive cash price that reflects that history with full transparency.',
}

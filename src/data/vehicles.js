const folder = '/2017-gmc-terrain-awd-sle'

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
  coverImage: imagePath('hero-front.jpg'),
  gallery: [
    imagePath('hero-front.jpg'),
    imagePath('front-view.jpg'),
    imagePath('front-three-quarter.jpg'),
    imagePath('driver-side-profile.jpg'),
    imagePath('passenger-side-profile.jpg'),
    imagePath('rear-view.jpg'),
    imagePath('rear-view-angle.jpg'),
    imagePath('rear-three-quarter.jpg'),
    imagePath('interior-front-cabin.jpg'),
    imagePath('interior-dashboard.jpg'),
    imagePath('interior-center-console.jpg'),
    imagePath('interior-rear-seats.jpg'),
    imagePath('interior-rear-detail.jpg'),
    imagePath('instrument-cluster.jpg'),
    imagePath('engine-bay.jpg'),
    imagePath('wheel-detail.jpg'),
    imagePath('cargo-area.jpg'),
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

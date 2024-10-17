import avatar from './images/Your_profil_pict.png'
import Logo from './images/42_logo.svg'

const iconsData = 
    [
        <i className="fa-brands fa-github fa-lg"></i>,
        <i className="fa-brands fa-linkedin fa-lg"></i>,
        <img src={Logo} alt="" />
    ]


const CreatorsData = [
    {
        id : 1,
        name: "Naima El Baz",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        id: 2,
        name: "Hamza Oumansour",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        id: 3,
        name: "Yasmine Lachhab",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        id: 4,
        name: "Issam Abkadri",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
]

export default CreatorsData
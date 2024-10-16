import avatar from './images/Your_profil_pict.png'
import Logo from './images/42_logo.svg'

const iconsData = 
    [
        <i className="fa-brands fa-github"></i>,
        <i className="fa-brands fa-linkedin"></i>,
        <img src={Logo} alt="" />
    ]


const CreatorsData = [
    {
        name: "Naima El Baz",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        name: "Hamza Oumansour",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        name: "Yasmine Lachhab",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
    {
        name: "Issam Abkadri",
        specialty: "FullStack Developer",
        icons: iconsData,
        img: <img src={avatar} alt="" />
    },
]

export default CreatorsData
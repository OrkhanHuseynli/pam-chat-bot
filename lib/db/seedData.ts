export interface Dinosaur {
    name: string;
    description: string;
    diet: string;   
    habitat: string;
}

export interface DinosaurEntity extends Dinosaur {
    id: string;
    embedding: number[];
}

export const dinosaursData = [
    {
        "name": "Tyrannosaurus Rex",
        "description": "A large carnivorous dinosaur that lived during the late Cretaceous period. It had a massive skull balanced by a long, heavy tail.",
        "diet": "Carnivorous",
        "habitat": "Forests and river valleys"
    },
    {
        "name": "Triceratops",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It is known for its three horns and large bony frill.",
        "diet": "Herbivorous",
        "habitat": "Plains and forests"
    },
    {
        "name": "Velociraptor",
        "description": "A small, carnivorous dinosaur that lived during the late Cretaceous period. It was known for its speed and agility.",
        "diet": "Carnivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Stegosaurus",
        "description": "A herbivorous dinosaur that lived during the late Jurassic period. It had distinctive plates along its back and a spiked tail.",
        "diet": "Herbivorous",
        "habitat": "Woodlands and plains"
    },
    {
        "name": "Brachiosaurus",
        "description": "A large herbivorous dinosaur that lived during the late Jurassic period. It had a long neck and forelimbs that were longer than its hind limbs.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and riverbanks"
    },
    {
        "name": "Allosaurus",
        "description": "A large carnivorous dinosaur that lived during the late Jurassic period. It had a large skull with dozens of sharp teeth.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Apatosaurus",
        "description": "A large herbivorous dinosaur that lived during the late Jurassic period. It had a long neck and tail, and was one of the largest land animals.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and forests"
    },
    {
        "name": "Ankylosaurus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a heavily armored body and a large club-like tail.",
        "diet": "Herbivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Spinosaurus",
        "description": "A large carnivorous dinosaur that lived during the mid-Cretaceous period. It had a distinctive sail-like structure on its back.",
        "diet": "Carnivorous",
        "habitat": "River deltas and coastal regions"
    },
    {
        "name": "Diplodocus",
        "description": "A large herbivorous dinosaur that lived during the late Jurassic period. It had a long neck and tail, and was one of the longest dinosaurs.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and forests"
    },
    {
        "name": "Iguanodon",
        "description": "A herbivorous dinosaur that lived during the early Cretaceous period. It had a large thumb spike and was one of the first dinosaurs to be discovered.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Parasaurolophus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a long, curved crest on its head.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Pteranodon",
        "description": "A large flying reptile that lived during the late Cretaceous period. It had a wingspan of over 6 meters and a long, toothless beak.",
        "diet": "Carnivorous (fish and small animals)",
        "habitat": "Coastal regions and cliffs"
    },
    {
        "name": "Pachycephalosaurus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a thick, domed skull that it may have used for head-butting.",
        "diet": "Herbivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Gallimimus",
        "description": "A small, omnivorous dinosaur that lived during the late Cretaceous period. It was known for its speed and bird-like appearance.",
        "diet": "Omnivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Carnotaurus",
        "description": "A large carnivorous dinosaur that lived during the late Cretaceous period. It had distinctive horns above its eyes and a very short snout.",
        "diet": "Carnivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Compsognathus",
        "description": "A small carnivorous dinosaur that lived during the late Jurassic period. It was one of the smallest known dinosaurs.",
        "diet": "Carnivorous",
        "habitat": "Forests and coastal regions"
    },
    {
        "name": "Deinonychus",
        "description": "A carnivorous dinosaur that lived during the early Cretaceous period. It had a large, sickle-shaped claw on each foot.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Diplocaulus",
        "description": "A small, amphibious reptile that lived during the late Permian period. It had a distinctive boomerang-shaped head.",
        "diet": "Carnivorous (fish and small animals)",
        "habitat": "Swamps and riverbanks"
    },
    {
        "name": "Giganotosaurus",
        "description": "A large carnivorous dinosaur that lived during the late Cretaceous period. It was one of the largest known terrestrial carnivores.",
        "diet": "Carnivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Kentrosaurus",
        "description": "A herbivorous dinosaur that lived during the late Jurassic period. It had a series of small plates and spikes along its back and tail.",
        "diet": "Herbivorous",
        "habitat": "Woodlands and plains"
    },
    {
        "name": "Maiasaura",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It is known for evidence suggesting it cared for its young.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Megalosaurus",
        "description": "A large carnivorous dinosaur that lived during the mid-Jurassic period. It was one of the first dinosaurs to be scientifically described.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Mosasaurus",
        "description": "A large marine reptile that lived during the late Cretaceous period. It had a long, streamlined body and powerful jaws.",
        "diet": "Carnivorous (fish and marine animals)",
        "habitat": "Oceans and coastal regions"
    },
    {
        "name": "Oviraptor",
        "description": "A small, omnivorous dinosaur that lived during the late Cretaceous period. It had a beak-like mouth and was initially thought to steal eggs.",
        "diet": "Omnivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Plesiosaurus",
        "description": "A large marine reptile that lived during the early Jurassic period. It had a long neck, small head, and flippers for swimming.",
        "diet": "Carnivorous (fish and marine animals)",
        "habitat": "Oceans and coastal regions"
    },
    {
        "name": "Quetzalcoatlus",
        "description": "A large flying reptile that lived during the late Cretaceous period. It had a wingspan of up to 10 meters and was one of the largest known flying animals.",
        "diet": "Carnivorous (fish and small animals)",
        "habitat": "Coastal regions and cliffs"
    },
    {
        "name": "Sauropelta",
        "description": "A herbivorous dinosaur that lived during the early Cretaceous period. It had a heavily armored body and a row of large spines along its back.",
        "diet": "Herbivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Styracosaurus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a large frill with multiple long spikes and a single large horn on its nose.",
        "diet": "Herbivorous",
        "habitat": "Plains and forests"
    },
    {
        "name": "Therizinosaurus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had long, clawed forelimbs and a beak-like mouth.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Troodon",
        "description": "A small, omnivorous dinosaur that lived during the late Cretaceous period. It had a large brain relative to its body size and keen senses.",
        "diet": "Omnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Albertosaurus",
        "description": "A large carnivorous dinosaur that lived during the late Cretaceous period. It was closely related to Tyrannosaurus Rex but slightly smaller.",
        "diet": "Carnivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Archaeopteryx",
        "description": "A small, bird-like dinosaur that lived during the late Jurassic period. It is considered one of the earliest known birds.",
        "diet": "Carnivorous (insects and small animals)",
        "habitat": "Forests and coastal regions"
    },
    {
        "name": "Baryonyx",
        "description": "A large carnivorous dinosaur that lived during the early Cretaceous period. It had a long, crocodile-like snout and large claws.",
        "diet": "Carnivorous (fish and small animals)",
        "habitat": "Riverbanks and floodplains"
    },
    {
        "name": "Camarasaurus",
        "description": "A large herbivorous dinosaur that lived during the late Jurassic period. It had a short, boxy skull and a long neck.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and forests"
    },
    {
        "name": "Corythosaurus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a distinctive helmet-like crest on its head.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Dilophosaurus",
        "description": "A carnivorous dinosaur that lived during the early Jurassic period. It had two crests on its head and was known for its speed.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Edmontosaurus",
        "description": "A large herbivorous dinosaur that lived during the late Cretaceous period. It had a flat, duck-billed snout.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Euoplocephalus",
        "description": "A herbivorous dinosaur that lived during the late Cretaceous period. It had a heavily armored body and a club-like tail.",
        "diet": "Herbivorous",
        "habitat": "Forests and open plains"
    },
    {
        "name": "Gigantoraptor",
        "description": "A large, bird-like dinosaur that lived during the late Cretaceous period. It had a beak and was likely covered in feathers.",
        "diet": "Omnivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Herrerasaurus",
        "description": "A carnivorous dinosaur that lived during the late Triassic period. It was one of the earliest known dinosaurs.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Hypsilophodon",
        "description": "A small herbivorous dinosaur that lived during the early Cretaceous period. It was known for its speed and agility.",
        "diet": "Herbivorous",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Mamenchisaurus",
        "description": "A large herbivorous dinosaur that lived during the late Jurassic period. It had an exceptionally long neck.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and forests"
    },
    {
        "name": "Microraptor",
        "description": "A small, feathered dinosaur that lived during the early Cretaceous period. It had wings on both its arms and legs.",
        "diet": "Carnivorous (insects and small animals)",
        "habitat": "Forests and floodplains"
    },
    {
        "name": "Ornithomimus",
        "description": "A small, omnivorous dinosaur that lived during the late Cretaceous period. It resembled modern ostriches.",
        "diet": "Omnivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Protoceratops",
        "description": "A small herbivorous dinosaur that lived during the late Cretaceous period. It had a large frill and a beak-like mouth.",
        "diet": "Herbivorous",
        "habitat": "Deserts and arid regions"
    },
    {
        "name": "Saltasaurus",
        "description": "A large herbivorous dinosaur that lived during the late Cretaceous period. It had a long neck and a body covered in bony plates.",
        "diet": "Herbivorous",
        "habitat": "Floodplains and forests"
    },
    {
        "name": "Theropoda",
        "description": "A diverse group of carnivorous dinosaurs that includes species like Tyrannosaurus Rex and Velociraptor.",
        "diet": "Carnivorous",
        "habitat": "Various habitats including forests, plains, and deserts"
    },
    {
        "name": "Utahraptor",
        "description": "A large carnivorous dinosaur that lived during the early Cretaceous period. It had large, sickle-shaped claws on its feet.",
        "diet": "Carnivorous",
        "habitat": "Forests and floodplains"
    }
]

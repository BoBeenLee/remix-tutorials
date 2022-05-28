import { prisma } from '../app/libs/prisma.server';

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/
  return [
    {
      id: "1",
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      id: "2",
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      id: "3",
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      id: "4",
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      id: "5",
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      id: "6",
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      id: "7",
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}

function getPosts() {
  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
      markdown: `
  # This is my first post
  
  Isn't it great?
      `.trim(),
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
      markdown: `
  # 90s Mixtape
  
  - I wish (Skee-Lo)
  - This Is How We Do It (Montell Jordan)
  - Everlong (Foo Fighters)
  - Ms. Jackson (Outkast)
  - Interstate Love Song (Stone Temple Pilots)
  - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  - Just a Friend (Biz Markie)
  - The Man Who Sold The World (Nirvana)
  - Semi-Charmed Life (Third Eye Blind)
  - ...Baby One More Time (Britney Spears)
  - Better Man (Pearl Jam)
  - It's All Coming Back to Me Now (Céline Dion)
  - This Kiss (Faith Hill)
  - Fly Away (Lenny Kravits)
  - Scar Tissue (Red Hot Chili Peppers)
  - Santa Monica (Everclear)
  - C'mon N' Ride it (Quad City DJ's)
      `.trim(),
    },
  ];
  return posts;
}

async function main() {
  console.log(`Start seeding ...`);

  await Promise.all(getPosts().map(post => {
    return prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }))

  await Promise.all(
    getJokes().map((joke) => {
      return prisma.joke.upsert({
        where: {
          id: joke.id,
        }, update: joke, create: joke
      });
    })
  );

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

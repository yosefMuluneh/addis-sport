import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.club.deleteMany();
  await prisma.admin.deleteMany();

  // Seed admin (single admin for now)
  await prisma.admin.create({
    data: {
      id: "1",
      username: "admin",
      password: "admin123",
    },
  });

  // Seed clubs (data from the .docx file)
  const clubs = [
    { sportCode: "1/1", sportName: "ኤሊት ኢንተርናሽናል ቴኳንዶ", clubCode: "AA001", clubName: "ዋን ላቭ ኤሊት ኢንተርናሽናል ቴኳንዶ", subCity: "", district: "", phone: "", registrationYear: "111/14", documentPath: [] },
    { sportCode: "1/1", sportName: "ኤሊት ኢንተርናሽናል ቴኳንዶ", clubCode: "AA002", clubName: "ጋሻ ኤሊት ኢንተርናሽናል ቴኳንዶ", subCity: "ጉለሌ", district: "8", phone: "0913134128", registrationYear: "134/15", documentPath: [] },
    { sportCode: "1/1", sportName: "ኤሊት ኢንተርናሽናል ቴኳንዶ", clubCode: "AA003", clubName: "ቢ ኤች ኤሊት ኢንተርናሽናል ቴኳንዶ", subCity: "ለሚኩራ", district: "6", phone: "0904109111", registrationYear: "135/15", documentPath: [] },
    { sportCode: "1/2", sportName: "ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA004", clubName: "ሀይሚ ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", subCity: "አ/ቃለሊቲ", district: "8", phone: "0991810250", registrationYear: "131/15", documentPath: [] },
    { sportCode: "1/2", sportName: "ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA005", clubName: "አሊፍ ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", subCity: "ቦሌ", district: "2", phone: "0947363109", registrationYear: "136/16", documentPath: [] },
    { sportCode: "1/2", sportName: "ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA006", clubName: "ዳዋ ወስቢ ኢትዮ ዩናይትድ ኢንተርናሽናል ቴኳንዶ", subCity: "ን/ስ/ላፍቶ", district: "15", phone: "0985397070", registrationYear: "137/16", documentPath: [] },
    { sportCode: "1/3", sportName: "አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA007", clubName: "ቢፍቱ አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", subCity: "ኮ/ቀራኒዮ", district: "5", phone: "0929529111", registrationYear: "130/15", documentPath: [] },
    { sportCode: "1/3", sportName: "አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA008", clubName: "ኤም አር ጀምስ አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", subCity: "ለሚኩራ", district: "5", phone: "0910310986", registrationYear: "131/16", documentPath: [] },
    { sportCode: "1/3", sportName: "አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", clubCode: "AA009", clubName: "ኤ ቢ ፕላስ አዲስ አበባ ኢንተርናሽናል ቴኳንዶ", subCity: "ኮ/ቀራኒዮ", district: "3", phone: "0986690274", registrationYear: "132/16", documentPath: [] },
    { sportCode: "2", sportName: "አትሌቲክስ", clubCode: "AA010", clubName: "ኢትዮ ኤሊት አትሌቲክስ ክለብ", subCity: "ቦሌ", district: "7", phone: "0921452809", registrationYear: "83/15", documentPath: [] },
    { sportCode: "2", sportName: "አትሌቲክስ", clubCode: "AA011", clubName: "ጥቁር ግስላ አትሌቲክስ ክለብ", subCity: "ለሚኩራ", district: "3", phone: "0911048380", registrationYear: "84/15", documentPath: [] },
    { sportCode: "2", sportName: "አትሌቲክስ", clubCode: "AA012", clubName: "ኢትዮ ልጆች አትሌቲክስ ክለብ", subCity: "የካ", district: "2", phone: "0913244442", registrationYear: "85/15", documentPath: [] },
    { sportCode: "3", sportName: "ወርልድ ቴኳንዶ", clubCode: "AA013", clubName: "ጂ ኤም ግርማ ወርልድ ቴኳንዶ ክለብ", subCity: "ን/ስ/ላፍቶ", district: "1", phone: "0913864516", registrationYear: "151/15", documentPath: [] },
    { sportCode: "3", sportName: "ወርልድ ቴኳንዶ", clubCode: "AA014", clubName: "ሀኒ ወርልድ ቴኳንዶ ክለብ", subCity: "ለሚኩራ", district: "2", phone: "0910020237", registrationYear: "157/15", documentPath: [] },
    { sportCode: "3", sportName: "ወርልድ ቴኳንዶ", clubCode: "AA015", clubName: "ሚኪ ወርልድ ቴኳንዶ ክለብ", subCity: "ለሚኩራ", district: "3", phone: "0922787717", registrationYear: "162/15", documentPath: [] },
    { sportCode: "4", sportName: "እግር ኳስ", clubCode: "AA016", clubName: "ጥበብ በራስ ካሳ እግር ኳስ ክለብ", subCity: "የካ", district: "1", phone: "0922828539", registrationYear: "220/15", documentPath: [] },
    { sportCode: "4", sportName: "እግር ኳስ", clubCode: "AA017", clubName: "ሸገር አዲስ እግር ኳስ ክለብ", subCity: "አራዳ", district: "4", phone: "0910035191", registrationYear: "232/16", documentPath: [] },
    { sportCode: "4", sportName: "እግር ኳስ", clubCode: "AA018", clubName: "ቅዱስ ሌጋሲ እግር ኳስ ክለብ", subCity: "የካ", district: "8", phone: "0968595201", registrationYear: "235/16", documentPath: [] },
  ];

  await prisma.club.createMany({ data: clubs });
  console.log("Seeded clubs:", clubs);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
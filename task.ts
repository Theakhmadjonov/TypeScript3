// 1-mashq

function LogClass(target: any) {
  const className = target.name;
  const currentTime = new Date().toISOString();
  console.log(`${className} class yaratildi: ${currentTime}`);
}

@LogClass
class User {
  constructor(public name: string, public age: number) {}
}

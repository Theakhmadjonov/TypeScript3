import "reflect-metadata";

// 1-mashq

// function LogClass(target: any) {
//   const className = target.name;
//   const currentTime = new Date().toISOString();
//   console.log(`${className} class yaratildi vahti ${currentTime}`);
// }

// @LogClass
// class User {
//   constructor(public name: string, public age: number) {}
// }

// // 2-mashq

function ReadOnly(target: any, propertyKey: string) {
  const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
  if (descriptor && descriptor.writable !== undefined) {
    descriptor.writable = false;
    Object.defineProperty(target, propertyKey, descriptor);
  }
}

class Product {
  public name: string;
  constructor(name: string, public price: number) {
    this.name = name;
  }
  //@ts-ignore
  @ReadOnly
  changeName(newName: string) {
    this.name = newName;
  }
}
const newProduct = new Product("Samsung A22", 1200);
newProduct.changeName("Samsung A21");
console.log(newProduct);

// 3-mashq

function TimeMeasure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const startTime = Date.now();
    const result = originalMethod.apply(this, args);
    const endTime = Date.now();
    console.log(
      `${propertyKey} metodining ishlash vaqti: ${endTime - startTime}ms`
    );
    return result;
  };

  return descriptor;
}

class DataProcessor {
  @TimeMeasure
  processData(data: number[]) {
    for (let i = 0; i < 1000000; i++) {
      data = data.map((x) => x * 2);
    }
    return data;
  }
}

const newProcess = new DataProcessor();
newProcess.processData([1, 2, 3, 4, 5]);

// 4-mashq

function ValidatePositive(
  target: any,
  methodName: string,
  parameterIndex: number
) {
  const existingValidation: any[] =
    Reflect.getOwnMetadata("design:paramtypes", target, methodName) || [];
  existingValidation[parameterIndex] = (value: any) => {
    if (parameterIndex <= 0) {
      return `${methodName} parametr musbat bo'lishi kerak`;
    }
  };
  Reflect.defineMetadata(
    "design:paramtypes",
    existingValidation,
    target,
    methodName
  );
}

class BankAccount {
  //@ts-ignore
  @ValidatePositive
  private balance: number = 0;
  deposit(amount: number) {
    this.balance += amount;
    return this.balance;
  }
}

const account = new BankAccount();
console.log(account.deposit(-1));

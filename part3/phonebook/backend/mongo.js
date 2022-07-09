const mongoose = require('mongoose');

/** extract password from argument */
const password = (function extractPassword() {
  if (process.argv.length < 3) {
    console.error(
      'Please provide the password as an argument: node mongo.js <password>'
    );
    process.exit(1);
  } else {
    return process.argv[2];
  }
})();

/** extract name and number from argument if exist */
const [name, number] = (function extractNameAndNumber() {
  if (process.argv.length > 3) {
    return [process.argv[3], process.argv[4]];
  } else return [];
})();

/** connection str and schema of mongo db  */
const url = `mongodb+srv://rick:${password}@cluster0.dnxa0.mongodb.net/?retryWrites=true&w=majority`;
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

/** save a new phonebook record */
const savePerson = async () => {
  try {
    await mongoose.connect(url);
    const newPerson = new Person({
      name,
      number,
    });
    await newPerson.save();
    mongoose.connection.close();
    console.log(`added ${name} number ${number} to phonebook`);
  } catch (error) {
    console.error(error);
  }
};

/** get all phonebook records */
const printAllPeople = async () => {
  try {
    await mongoose.connect(url);
    const people = await Person.find({});
    mongoose.connection.close();
    console.log('phonebook:');
    people.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });
  } catch (error) {
    console.error(error);
  }
};

/** if name && number exists, save the new record, otherwise, print all phonebooks */
if (name && number) {
  savePerson();
} else {
  printAllPeople();
}

import classesData from "@/services/mockData/classes.json"

let classes = [...classesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const classService = {
  async getAll() {
    await delay()
    return [...classes]
  },

  async getById(id) {
    await delay()
    return classes.find(cls => cls.Id === parseInt(id))
  },

  async create(classData) {
    await delay()
    const newId = Math.max(...classes.map(c => c.Id), 0) + 1
    const newClass = {
      Id: newId,
      ...classData,
      studentIds: []
    }
    classes.push(newClass)
    return newClass
  },

  async update(id, classData) {
    await delay()
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      classes[index] = { ...classes[index], ...classData }
      return classes[index]
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      const deletedClass = classes.splice(index, 1)[0]
      return deletedClass
    }
    return null
  }
}
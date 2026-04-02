const studentResponseDTO = (student)=>{
    return {
        id : student._id,
        name : student.name,
        email : student.email,
        age : student.age,
        major : student.major,
    }
}
const studentRequestDTO = (body) =>{
    return {
        name : body.name?.trim(),
        email : body.email?.trim(),
        age:body.age,
        major : body.major?.trim()
    }
}
export default {studentResponseDTO, studentRequestDTO}


const studentResponseDTO = (student)=>{
    return {
        id : student._id,
        name : student.name,
        email : student.email,
        age : student.age,
        major : student.major,
    }
}
export default {studentResponseDTO}

const returnCompletedSection = ({sections, progresses}) => 
    new Promise((resolve, reject) => {
        let result = [];
        if (!progresses) {
            reject("No progress records provided");
        }
        if (!sections) {
            reject("No sections provided");
        }
        progresses.forEach(progress => {
            const progressSectionName = progress.sectionName;
            const numCompletedMaterials = progress.sectionMaterialName.length;
            const isQuizComplete = progress.isSectionQuizComplete;

            let section = sections.find(o => o.sectionName == progressSectionName);
            const totalNumMaterials = section.sectionMaterial.length;
            if (numCompletedMaterials == totalNumMaterials && isQuizComplete) {
                result.push(section.sectionName);
            }
        });
        resolve(result);
    })

module.exports = returnCompletedSection;
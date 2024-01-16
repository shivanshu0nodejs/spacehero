

const homePage = async (req, res) => {

    try{

        res.send("Space Hero Running....!!!!");

    }catch(e){

        console.log(e);

    }
}


module.exports = {homePage};
const path = require('path');
const moment = require('moment');
const {Post, Soal, PaketSoal} = require(path.join(__dirname,'../models/index'));
const {pagination,getImages,getDesc} = require(path.join(__dirname,'../custom-function/funct'));

// Show all blog Data
const blogList = async (req, res)=>{
    let URLQuery = pagination(req.query);

    try {
        const posts = await Post.findAndCountAll({
            limit:URLQuery.pageSize,
            offset:URLQuery.offset,
            order:[
                ['updatedAt','DESC']
            ]
        });    

        // get image and desc from post
    posts.rows.forEach(element => {
        let imagesArr = getImages(element.body); //get images from html string
        element.image = imagesArr[0];
        // if image doesn't exist use the default image
        if(!element.image){
            element.image = "/img/default-post.jpg"
        }
        let desc = getDesc(element.body); //get description from teks
        element.desc = desc;

        // Change format date
        let dateVal = element.updatedAt;
        dateVal = dateVal.toString();
        dateVal = new Date(dateVal);
        dateVal = moment(dateVal).format('DD MMMM YYYY')
        element.datePost = dateVal;
    });

    res.render('blog',{posts,URLQuery});

    } catch (error) {
        console.log(error);
    }
};

// go to insert Post page
const insertPostPage = async(req,res)=>{
    res.render('insert-post');
}

// Show one Post from Id
const showPost = async(req,res)=>{
    const id = req.params.id;
    try{
        const post = await Post.findByPk(id);
    // res.json(post)
    res.render('show_post',{post});
    }catch(err){
        console.log(err);
    }
};

// Go to Edit Post page
const editPostPage = async(req,res)=>{
    const id = req.params.id.trim();
    try {
        const data = await Post.findByPk(id);
        res.render('edit_post',{post:data});    
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

// insert Post to Database
const insertPost = async (req,res)=>{
    const request = req.body;
    // console.log(request);
    if(request.title==''){
        request.title="Judul post Default ";
    }
    try{
        const data = await Post.create({
            title:request.title,
            body:request.body,
            geogebra:request.geogebra
        });
        res.redirect('/blog');
    }catch(err){
        console.log(err);
    }
};

// edit and Update Post To Database
const updatePost = async(req,res)=>{
    const id = req.params.id.trim();
    const request = req.body;
    try {
        const data = await Post.update({
            title:request.title,
            body:request.body,
            geogebra:request.geogebra,
        },{
            where:{
                id:id
            }
        });
        res.redirect(`/blog`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

// delete Post From Database
const deletePost = async(req,res)=>{
    let id = req.params.id.trim();
    try{
        const data = await Post.destroy({
            where:{
                id:id
            }
        });
        const result = {
            notif:"berhasil dihapus"
        }
        return res.json({"notif":"berhasil"});
    }catch(err){
        console.log(err);
        res.json(err);
    }
};



module.exports = {
    blogList,
    insertPostPage,
    showPost,
    editPostPage,
    insertPost,
    updatePost,
    deletePost
}
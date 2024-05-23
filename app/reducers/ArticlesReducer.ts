
export default function ArticlesReducer(articlesData: any[] , action:any) {
    switch (action?.type) {
        case 'add':
             let newData = [
                ...articlesData,
                {   
                    id:action?.id,
                    title :action?.title,
                    createdAt:action?.createdAt
                }
            ]
            return newData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            ;
    
        case 'initial-articles':
            return action.articlesData;

        case 'edit-title':
            return articlesData.map((article: { id: any; title: any; createdAt: any; })=>{
                if(action.id===article.id){
                    article.title = action.newTitle
                    article.createdAt = action.createdAt
                }
                return article;
            }).sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            ;

        case 'delete-title':
            let newDataDeleted=articlesData.filter((article: { id: any; })=>{
                return action.id!==article.id;
            }).sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            return newDataDeleted;
    
        default:
            return articlesData;
    }
}

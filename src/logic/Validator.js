class Validator {

    date(data){
        if (typeof data == "string" && data.length == 10 && this.validateDate(data)) {
            return {success: 1}
        }else if(data.length < 10){
            return {success: 0, error:'A data deve seguir o seguinte padrão dd/mm/aaaa'}
        }else if(!data.match("\\d{2}/\\d{2}/\\d{4}")){
            return {success: 0, error:'A data deve seguir o seguinte padrão dd/mm/aaaa'}
        }
        return {success: 0, error:'A data deve ser do tipo string e seguir o seguinte padrão dd/mm/aaaa'}
    }

    validateDate(data) {
        
        var regex = "\\d{2}/\\d{2}/\\d{4}"
        var dtArray = data.split("/")

        if (dtArray == null)
            return false


        var dtDay= dtArray[0]
        var dtMonth = dtArray[1]
        var dtYear = dtArray[2]

        if (dtMonth < 1 || dtMonth > 12)
            return false
        else if (dtDay < 1 || dtDay> 31)
            return false
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
            return false
        else if (dtMonth == 2)
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap))
                return false
        }
        return true
    }
}

module.exports = new Validator
from urllib import request
import uuid  
import pyamf
import json,datetime  
from pyamf import remoting  
from pyamf.flex import messaging  

class CC:
    cityAndType = []
class DateEncoder(json.JSONEncoder): 
    def default(self, obj): 
        if isinstance(obj, datetime.datetime): 
            return obj.strftime('%Y-%m-%d %H:%M:%S') 
        elif isinstance(obj, date): 
            return obj.strftime("%Y-%m-%d") 
        else: 
            return json.JSONEncoder.default(self, obj)
def getTypesAndCitys():
    msg = messaging.RemotingMessage(messageId=str(uuid.uuid1()).upper(),  
                                        clientId=str(uuid.uuid1()).upper(),  
                                        operation='getHqInitData',  
                                        destination='reportStatService',  
                                        timeToLive=0,  
                                        timestamp=0)  
    def getRequestData():
        msg.body = []  
        msg.headers['DSEndpoint'] = None  
        msg.headers['DSId'] = str(uuid.uuid1()).upper()  
        req = remoting.Request('null', body=(msg,))  
        env = remoting.Envelope(amfVersion=pyamf.AMF3)  
        env.bodies = [('/1', req)]  
        data = bytes(remoting.encode(env).read())
        return data
    def getResponse(data):
        url = 'http://jgsb.agri.cn/messagebroker/amf'
        req = request.Request(url, data, headers={'Content-Type': 'application/x-amf'})
        opener = request.build_opener()          
        return opener.open(req).read()
    def getContent(response):
        amf_parse_info = remoting.decode(response)
        types = amf_parse_info.bodies[0][1].body.body[0]
        citys = amf_parse_info.bodies[0][1].body.body[1]
        return types, citys
    def store2json(types, citys):
        res = []
        typeObj = {}
        cityObj = {}
        for x1,y1 in enumerate(types):
            for x2,y2 in enumerate(y1['children']):
                typeObj[y2['itemcode']] = y1['itemname']
        for x1,y1 in enumerate(citys):
            for x2,y2 in enumerate(y1['children']):
                cityObj[y2['marketCode']] = y1['itemname']
        res.append(typeObj)
        res.append(cityObj)
        fp = open('data_cityAndType.json','r') 
        #dump: 将数据写入json文件中
        #json.dump(res,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        #load:把文件打开，并把字符串变换为数据类型
        CC.cityAndType = json.load(fp)
        fp.close()
    reqData = getRequestData()
    rep = getResponse(reqData)
    types, citys = getContent(rep)
    store2json(types, citys)
def getListAll():
    class HqPara:    
        def __init__(self):  
            self.marketInfo = None  
            self.breedInfoDl = None  
            self.breedInfo = None  
            self.provice = None  
    pyamf.register_class(HqPara, alias='com.itown.kas.pfsc.report.po.HqPara')  
    msg = messaging.RemotingMessage(messageId=str(uuid.uuid1()).upper(),  
                                        clientId=str(uuid.uuid1()).upper(),  
                                        operation='getHqSearchData',  
                                        destination='reportStatService',  
                                        timeToLive=0,  
                                        timestamp=0)  
    def getRequestData(page_num,total_num):
        msg.body = [HqPara(),str(page_num), str(total_num)]  
        msg.headers['DSEndpoint'] = None  
        msg.headers['DSId'] = str(uuid.uuid1()).upper()  
        req = remoting.Request('null', body=(msg,))  
        env = remoting.Envelope(amfVersion=pyamf.AMF3)  
        env.bodies = [('/1', req)]  
        data = bytes(remoting.encode(env).read())
        return data
    def getResponse(data):
        url = 'http://jgsb.agri.cn/messagebroker/amf'
        req = request.Request(url, data, headers={'Content-Type': 'application/x-amf'})
        opener = request.build_opener()          
        return opener.open(req).read()
    def getContent(response):
        amf_parse_info = remoting.decode(response)
        total_num = amf_parse_info.bodies[0][1].body.body[3]
        info = amf_parse_info.bodies[0][1].body.body[0]
        return total_num, info
    def store2json(info):
        res = []
        for record in info:
            record['reportDate'] = record['reportDate'].strftime('%Y-%m-%d %H:%M:%S')
            record['auditDate'] = record['auditDate'].strftime('%Y-%m-%d %H:%M:%S')
            res.append(record)
        fp = open('data_listData.json','r') 
        #dump: 将数据写入json文件中
        #json.dump(res,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        #load:把文件打开，并把字符串变换为数据类型
        res = json.load(fp)
        fp.close()
        result = []
        for record in res:
            record['cityName'] = CC.cityAndType[0][record['farmProduceCode']]
            record['produceName'] = CC.cityAndType[1][record['marketCode']]
            result.append(record)
        fp = open('data_all.json','w') 
        json.dump(result,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        fp.close()
    reqData = getRequestData(1,15)
    rep = getResponse(reqData)
    total_num,info = getContent(rep)
    #reqData = getRequestData(1,total_num)
    #rep = getResponse(reqData)
    #total_num,info = getContent(rep)
    store2json(info)
getTypesAndCitys()
getListAll()
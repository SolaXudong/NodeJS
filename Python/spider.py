from urllib import request
import uuid 
import pyamf
import json,schedule,time,datetime 
import pymysql
from pyamf import remoting 
from pyamf.flex import messaging 

# 参考文档：参考文档：https://github.com/LouisYZK/ShiXi_inWuhan/tree/master/1.23
# 资源：http://jgsb.agri.cn/controller?SERVICE_ID=REGISTRY_JCSJ_MRHQ_SHOW_SERVICE&recordperpage=15&newsearch=true&login_result_sign=nologin
# 构建全局使用的变量，在对象中
class CC:
    cityAndType = []
    totalCount = 15
    result = []
# 时间处理类
class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime("%Y-%m-%d")
        else:
            return json.JSONEncoder.default(self, obj)
# 请求下拉框数据
def getTypesAndCitys():
    msg = messaging.RemotingMessage(messageId=str(uuid.uuid1()).upper(), 
                                        clientId=str(uuid.uuid1()).upper(), 
                                        operation='getHqInitData', 
                                        destination='reportStatService', 
                                        timeToLive=0, 
                                        timestamp=0) 
    # 构造请求数据
    def getRequestData():
        msg.body = [] 
        msg.headers['DSEndpoint'] = None 
        msg.headers['DSId'] = str(uuid.uuid1()).upper() 
        req = remoting.Request('null', body=(msg,)) 
        env = remoting.Envelope(amfVersion=pyamf.AMF3) 
        env.bodies = [('/1', req)] 
        data = bytes(remoting.encode(env).read())
        return data
    # 获取响应源数据
    def getResponse(data):
        url = 'http://jgsb.agri.cn/messagebroker/amf'
        req = request.Request(url, data, headers={'Content-Type': 'application/x-amf'})
        opener = request.build_opener()         
        return opener.open(req).read()
    # 解析
    def getContent(response):
        amf_parse_info = remoting.decode(response)
        types = amf_parse_info.bodies[0][1].body.body[0]
        citys = amf_parse_info.bodies[0][1].body.body[1]
        CC.totalCount = amf_parse_info.bodies[0][1].body.body[2][3]
        print('##########typesCount: ', types.length)
        print('##########citysCount: ', citys.length)
        # 数据总条数
        print('##########totalCount: ', CC.totalCount)
        return types, citys
    # 处理
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
        CC.cityAndType = res
       
        # 文件处理
        fp = open('data_cityAndType.json','w',encoding='utf-8')
        # dump: 将数据写入json文件中
        json.dump(res,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        '''
        # load:把文件打开，并把字符串变换为数据类型
        CC.cityAndType = json.load(fp)
        '''
        fp.close()
       
    reqData = getRequestData()
    sst = time.time()
    rep = getResponse(reqData)
    print('getResponse,','cost: ',round((time.time()-sst),2),'s')
    types, citys = getContent(rep)
    sst = time.time()
    store2json(types, citys)
    print('store2json,','cost: ',round((time.time()-sst),2),'s')
#请求总数据
def getListAll():
    class HqPara:   
        def __init__(self): 
            self.marketInfo = None 
            self.breedInfoDl = None 
            self.breedInfo = None 
            self.provice = None 
    # https://en.wikipedia.org/wiki/Action_Message_Format 
    # registerClassAlias("personTypeAlias", Person); 
    # 注册自定义的Body参数类型，这样数据类型com.itown.kas.pfsc.report.po.HqPara就会在后面被一并发给服务端（否则服务端就可能返回参数不是预期的异常Client.Message.Deserialize.InvalidType） 
    pyamf.register_class(HqPara, alias='com.itown.kas.pfsc.report.po.HqPara') 
    # 构造flex.messaging.messages.RemotingMessage消息
    msg = messaging.RemotingMessage(messageId=str(uuid.uuid1()).upper(), 
                                        clientId=str(uuid.uuid1()).upper(), 
                                        operation='getHqSearchData', 
                                        destination='reportStatService', 
                                        timeToLive=0, 
                                        timestamp=0) 
    # 第一个是查询参数，第二个是页数，第三个是控制每页显示的数量（默认每页只显示15条）
    # 构造请求数据
    def getRequestData(page_num,total_num):
        msg.body = [HqPara(),str(page_num), str(total_num)] 
        msg.headers['DSEndpoint'] = None 
        msg.headers['DSId'] = str(uuid.uuid1()).upper() 
        # 按AMF协议编码数据 
        req = remoting.Request('null', body=(msg,)) 
        env = remoting.Envelope(amfVersion=pyamf.AMF3) 
        env.bodies = [('/1', req)] 
        data = bytes(remoting.encode(env).read())
        return data
    # 获取响应源数据
    def getResponse(data):
        url = 'http://jgsb.agri.cn/messagebroker/amf'
        req = request.Request(url, data, headers={'Content-Type': 'application/x-amf'})
        opener = request.build_opener()         
        return opener.open(req).read()
    # 解析
    def getContent(response):
        amf_parse_info = remoting.decode(response)
        info = amf_parse_info.bodies[0][1].body.body[0]
        return info
    # 处理
    def store2json(info):
        res = []
        for record in info:
            record['reportDate'] = record['reportDate'].strftime('%Y-%m-%d %H:%M:%S')
            record['auditDate'] = record['auditDate'].strftime('%Y-%m-%d %H:%M:%S')
            res.append(record)
           
        # 文件处理
        fp = open('data_listData.json','w',encoding='utf-8')
        # dump: 将数据写入json文件中
        json.dump(res,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        '''
        # load:把文件打开，并把字符串变换为数据类型
        res = json.load(fp)
        '''
        fp.close()
       
        for index,record in enumerate(res):
            if not(CC.cityAndType[0].__contains__(record['farmProduceCode'])):
                print('########## no data for product',record['farmProduceCode'],record['farmProduceName'],record['marketCode'],record['marketName'])
                #print(record)
                for x,y in enumerate(CC.cityAndType[0]):
                    if y.startswith(record['farmProduceCode'][0:2]):
                        print('    ',record['farmProduceCode'],CC.cityAndType[0][y])
                        record['produceName'] = CC.cityAndType[0][y]
                        break
            else:
                record['produceName'] = CC.cityAndType[0][record['farmProduceCode']]
            if not(CC.cityAndType[1].__contains__(record['marketCode'])):
                print('########## no data for city')
                #print(record)
                for x,y in enumerate(CC.cityAndType[1]):
                    if y.startswith(record['marketCode'][0:2]):
                        print('    ',record['marketCode'],CC.cityAndType[1][y])
                        record['cityName'] = CC.cityAndType[1][y]
                        break
            else:
                record['cityName'] = CC.cityAndType[1][record['marketCode']]
            CC.result.append(record)
            #break;
        fp = open('data_all.json','w',encoding='utf-8')
        json.dump(CC.result,fp,indent=4,cls=DateEncoder,ensure_ascii=False)
        fp.close()
    reqData = getRequestData(1,CC.totalCount)
    sst = time.time()
    rep = getResponse(reqData)
    print('getResponse,','cost: ',round((time.time()-sst),2),'s')
    info = getContent(rep)
    sst = time.time()
    store2json(info)
    print('store2json,','cost: ',round((time.time()-sst),2),'s')
# 导入MySQL
def insertMySQL():
    fp = open('data_all.json','r',encoding='utf-8')
    # load:把文件打开，并把字符串变换为数据类型
    CC.result = json.load(fp)
    fp.close()
    print(len(CC.result))
    # 打开数据库连接
    db = pymysql.connect("rm-tataliyun-aos-data.mysql.rdstest.tbsite.net","aos_app_plant","AOSproPlant*35","aos_app_plant" )
    # 使用 cursor() 方法创建一个游标对象 cursor
    cursor = db.cursor()
    # 使用 execute()  方法执行 SQL 查询
    cursor.execute("SELECT VERSION()")
    # 使用 fetchone() 方法获取单条数据.
    data = cursor.fetchone()
    print("数据库版本 : %s " % data)
    CC.result = [{"p1":"2019-05-09 12:29:59","p2":1,"p3":"2019-05-09"},{"p1":"2019-05-19 12:29:59","p2":2,"p3":"2019-05-19"}]
    for x,y in enumerate(CC.result):
        # SQL 插入语句
        # 注意：字符串或时间用，'%(p1)s'，数字用，%(p2)d
        sql = """INSERT INTO aos_zaoyang_production_predict_dd(
                 gmt_create, gmt_modified, county_id,
                 production_input_date, production_pre_date,
                 production_amount_high,production_amount_low,
                 production_date,production_amount,deleted
                 ) VALUES (
                 '%(p1)s', '%(p1)s', %(p2)d,
                 '%(p3)s', '%(p3)s',
                 %(p2)d, %(p2)d,
                 '%(p3)s', %(p2)d, %(p2)d
                 )"""
        sql = sql % dict(p1=y['p1'],p2=y['p2'],p3=y['p3'])
        #print(sql)
        try:
            # 执行sql语句
            cursor.execute(sql)
            # 提交到数据库执行
            db.commit()
        except RuntimeError as err:
            # 如果发生错误则回滚
            db.rollback()
            print(err)
    # 关闭数据库连接
    db.close()
# 测试（1.请求下拉框数据，2.请求总数据，3.入库）
def job1():
    print('【任务开始】...',time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    sst = time.time()
    getTypesAndCitys()
    getListAll()
    # insertMySQL()
    print('【任务结束】...','cost: ',round((time.time()-sst),2),'s')
job1()
# 定时器
schedule.every(86400).seconds.do(job1)
#schedule.every(1).hour.do(job)
#schedule.every().minutes.do(job)
#schedule.every().day.at("12:00").do(job)
while True:
    schedule.run_pending()
    time.sleep(0)
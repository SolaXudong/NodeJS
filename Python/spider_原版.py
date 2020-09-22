from urllib import request
import uuid  
import pyamf
import json,datetime  
from pyamf import remoting  
from pyamf.flex import messaging  
  
class HqPara:    
    def __init__(self):  
        self.marketInfo = None  
        self.breedInfoDl = None  
        self.breedInfo = None  
        self.provice = None  
# https://en.wikipedia.org/wiki/Action_Message_Format  
# registerClassAlias("personTypeAlias", Person);  
# ע���Զ����Body�������ͣ�������������com.itown.kas.pfsc.report.po.HqPara�ͻ��ں��汻һ����������ˣ��������˾Ϳ��ܷ��ز�������Ԥ�ڵ��쳣Client.Message.Deserialize.InvalidType��  
pyamf.register_class(HqPara, alias='com.itown.kas.pfsc.report.po.HqPara')  
  
# ����flex.messaging.messages.RemotingMessage��Ϣ

msg = messaging.RemotingMessage(messageId=str(uuid.uuid1()).upper(),  
                                    clientId=str(uuid.uuid1()).upper(),  
                                    operation='getHqSearchData',  
                                    destination='reportStatService',  
                                    timeToLive=0,  
                                    timestamp=0)  
# ��һ���ǲ�ѯ�������ڶ�����ҳ�����������ǿ���ÿҳ��ʾ��������Ĭ��ÿҳֻ��ʾ15����

# ������������
def getRequestData(page_num,total_num):
    msg.body = [HqPara(),str(page_num), str(total_num)]  
    msg.headers['DSEndpoint'] = None  
    msg.headers['DSId'] = str(uuid.uuid1()).upper()  
    # ��AMFЭ���������  
    req = remoting.Request('null', body=(msg,))  
    env = remoting.Envelope(amfVersion=pyamf.AMF3)  
    env.bodies = [('/1', req)]  
    data = bytes(remoting.encode(env).read())
    return data
# ��ȡ��ӦԴ����
def getResponse(data):
    url = 'http://jgsb.agri.cn/messagebroker/amf'
    req = request.Request(url, data, headers={'Content-Type': 'application/x-amf'})
    # ������������  
    opener = request.build_opener()          
    return opener.open(req).read()
# ����d
def getContent(response):
    amf_parse_info = remoting.decode(response)
    # ����������
    total_num = amf_parse_info.bodies[0][1].body.body[3]
    info = amf_parse_info.bodies[0][1].body.body[0]
    return total_num, info
def store2json(info):
    res = []
    for record in info:
        record['reportDate'] = record['reportDate'].strftime('%Y-%m-%d %H:%M:%S')
        record['auditDate'] = record['auditDate'].strftime('%Y-%m-%d %H:%M:%S')
        res.append(record)
    fp = open('info.json','w') 
    json.dump(res,fp,indent=4)
    fp.close()
# ����
reqData = getRequestData(1,15)
rep = getResponse(reqData)
total_num,info = getContent(rep)

reqData = getRequestData(1,total_num)
rep = getResponse(reqData)
total_num,info = getContent(rep)
store2json(info)
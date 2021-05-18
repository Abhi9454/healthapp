import 'package:flutter/material.dart';
import 'package:healthapp/views/HomePage/HomePageUI.dart';
import 'package:percent_indicator/linear_percent_indicator.dart';

class HomePageBody extends StatelessWidget {
  const HomePageBody({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Hi!',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: MediaQuery.of(context).size.width * 0.1,
                    ),
                  ),
                  Icon(
                    Icons.notifications,
                    color: Colors.black,
                  )
                ],
              ),
              SizedBox(
                height: MediaQuery.of(context).size.width * 0.1,
              ),
              Card(
                elevation: 10,
                shadowColor: Colors.black,
                color: Color(0xFFF0F0F0),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25)),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: MediaQuery.of(context).size.width * 0.05,
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Text(
                          'Steps  : 13112',
                          style: TextStyle(color: Colors.black, fontSize: 20),
                        ),
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(bottom: 10.0),
                                child: new LinearPercentIndicator(
                                  width: MediaQuery.of(context).size.width *
                                      0.65,
                                  animation: true,
                                  lineHeight: 20.0,
                                  animationDuration: 2500,
                                  percent: 0.8,
                                  center: Text("80.0%"),
                                  linearStrokeCap: LinearStrokeCap.roundAll,
                                  progressColor: Colors.black,
                                ),
                              ),
                              Container(
                                width: MediaQuery.of(context).size.width * 0.65 ,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      '0',
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 12
                                      ),
                                    ),
                                    Text(
                                      'Goal : 15000',
                                      style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 12
                                      ),
                                    )
                                  ],
                                ),
                              )
                            ],
                          ),
                          Image(
                            image: AssetImage('images/footstep.png'),
                            width: 60,
                            height: 60,
                          ),
                        ],
                      ),
                      SizedBox(
                        height: MediaQuery.of(context).size.width * 0.05,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(
                height: MediaQuery.of(context).size.width * 0.1,
              ),
              Card(
                elevation: 10,
                shadowColor: Colors.black,
                color: Color(0xFFF0F0F0),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25)),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: MediaQuery.of(context).size.width * 0.05,
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: Text(
                          'Calories Burner  : 500',
                          style: TextStyle(color: Colors.black, fontSize: 20),
                        ),
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(bottom: 10.0),
                                child: new LinearPercentIndicator(
                                  width: MediaQuery.of(context).size.width *
                                      0.65,
                                  animation: true,
                                  lineHeight: 20.0,
                                  animationDuration: 2500,
                                  percent: 0.5,
                                  center: Text("50.0%"),
                                  linearStrokeCap: LinearStrokeCap.roundAll,
                                  progressColor: Colors.black,
                                ),
                              ),
                              Container(
                                width:
                                MediaQuery.of(context).size.width * 0.65,
                                child: Row(
                                  mainAxisAlignment:
                                  MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      '0',
                                      style: TextStyle(
                                          color: Colors.black, fontSize: 12),
                                    ),
                                    Text(
                                      'Goal : 1000',
                                      style: TextStyle(
                                          color: Colors.black, fontSize: 12),
                                    )
                                  ],
                                ),
                              )
                            ],
                          ),
                          Image(
                            image: AssetImage('images/kcal.png'),
                            width: 60,
                            height: 60,
                          )
                        ],
                      ),
                      SizedBox(
                        height: MediaQuery.of(context).size.width * 0.05,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(
                height: MediaQuery.of(context).size.width * 0.1,
              ),
              Material(
                elevation: 10,
                shadowColor: Colors.black,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(MaterialPageRoute(builder: (context) => HomePage()));
                  },
                  style: ElevatedButton.styleFrom(
                      primary: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      textStyle: TextStyle(fontSize: 30),
                      padding: EdgeInsets.all(15)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Pill Box',
                        style: TextStyle(
                          color: Colors.black,
                        ),
                      ),
                      Icon(
                        Icons.arrow_forward_ios,
                        color: Colors.black,
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

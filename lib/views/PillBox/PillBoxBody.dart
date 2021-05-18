import 'package:flutter/material.dart';
import 'package:healthapp/config.dart';

class PillBoxBody extends StatelessWidget {
  const PillBoxBody({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image(
            image: AssetImage('images/pill1.png'),
            width: 60,
            height: 60,
          ),
          Container(
            width: MediaQuery.of(context).size.width * 0.40,
            child: Text(
              'Welcome to Pill Box, here you can add your medication and set a reminder for them.',
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              maxLines: 3,
              style: TextStyle(
                fontSize: 16,
              ),
            ),
          ),
          SizedBox(
            height: 5,
          ),
          Container(
            width: MediaQuery.of(context).size.width * 0.40,
            child: Text(
              'Let\'s start with adding your first medication',
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: TextStyle(
                fontSize: 16,
              ),
            ),
          ),
          SizedBox(
            height: 5,
          ),
          ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                primary: Colors.black,
                padding: EdgeInsets.all(15),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(35)),
              ),
              child: Row(
                children: [
                  Text(
                    'Add Medication',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Icon(
                      Icons.arrow_forward_ios,
                      color: AppConfig().primaryColor,
                    ),
                  ),
                ],
              )),
        ],
      ),
    );
  }
}

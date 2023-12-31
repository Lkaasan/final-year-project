import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const ViewApplication = ({ ID, type }) => {
  const [jobID, setJobID] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [userApplicationID, setUserApplicationID] = useState("");
  const [statusNum, setStatusNum] = useState();
  const [status, setStatus] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [usernameApplied, setUsernameApplied] = useState("");
  const [image, setImage] = useState(
    "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg"
  );
  useEffect(() => {
    fetch(
      "https://raptor.kent.ac.uk/proj/comp6000/project/08/applicationThumbnail.php",
      {
        //needs to be changed to your own ip
        method: "post",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationID: ID,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setJobID(responseJson[0]);
        setDate(responseJson[1]);
        setUserApplicationID(responseJson[2]);
        setPrice(responseJson[3]);
        setStatusNum(responseJson[4]);
        if (responseJson[4] == -1) {
          setStatus("Rejected");
        } else if (responseJson[4] == 0) {
          setStatus("Pending");
        } else if (responseJson[4] == 1) {
          setStatus("Accepted");
        }
        setJobTitle(responseJson[5]);
        if (responseJson[6] == null) {
          setImage(
            "https://raptor.kent.ac.uk/proj/comp6000/project/08/images/1.jpg"
          );
        } else {
          setImage(
            "https://raptor.kent.ac.uk/proj/comp6000/project/08/uploads/" +
              responseJson[6]
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const jobApplications = () => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/profile.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: userApplicationID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setUsernameApplied(responseJson[1]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const nav = useNavigation();

  const showApplication = () =>
    nav.navigate("Application", {
      ID,
      price,
      date,
      userApplicationID,
      statusNum,
      jobTitle,
      jobID,
    });

  const showJob = () => nav.navigate("Job", { jobID });

  if (type == "userApps") {
    return (
      <TouchableOpacity onPress={showJob}>
        <View style={styles.userApplicationContainer}>
          <Image
            source={{
              uri: image,
            }}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{jobTitle}</Text>
            <Text style={styles.description}>Status: {status}</Text>
            <Text style={styles.amount}>Offer: £{price}/h</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else if (type == "jobApps") {
    jobApplications();
    return (
      <TouchableOpacity onPress={showApplication}>
        <View style={styles.jobApplicationsContainer}>
          <View style={{ padding: 20 }}>
            <Text style={styles.title}>Username : {usernameApplied}</Text>
            <Text style={styles.description}>
              Status: <Text></Text>
              {status}
            </Text>
            <Text style={styles.amount}>Price offer: £{price}/h</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default ViewApplication;

const styles = StyleSheet.create({
  jobApplicationsContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "#EBEBEB",
    marginVertical: 20,
    elevation: 10,
  },
  userApplicationContainer: {
    width: 150,
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "#EBEBEB",
    marginVertical: 15,
    marginHorizontal: 8,
  },
  image: {
    height: 150,
    width: 150,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 6,
  },
  amount: {
    fontSize: 14,
    alignSelf: "flex-end",
    fontWeight: "bold",
    marginBottom: 10,
    marginEnd: 15,
  },

  info: {
    padding: 10,
    height: 100,
    backgroundColor: "#EBEBEB",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});

import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

actor {
  module Inquiry {
    public func compare(a : Inquiry, b : Inquiry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type Inquiry = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
    submittedBy : Principal;
  };

  var inquiryId = 0;
  let inquiries = Map.empty<Nat, Inquiry>();

  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, email : Text, message : Text) : async () {
    if (name == "" or phone == "" or email == "" or message == "") {
      Runtime.trap("All fields are required");
    };

    let newInquiry : Inquiry = {
      id = inquiryId;
      name;
      phone;
      email;
      message;
      timestamp = Time.now();
      submittedBy = caller;
    };

    inquiries.add(inquiryId, newInquiry);
    inquiryId += 1;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray().sort();
  };

  public query ({ caller }) func getInquiriesByUser(user : Principal) : async [Inquiry] {
    inquiries.values().filter(func(inquiry) { inquiry.submittedBy == user }).toArray();
  };
};

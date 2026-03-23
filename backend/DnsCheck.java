public class DnsCheck {
  public static void main(String[] args) throws Exception {
    var host = "ep-muddy-dream-ant9m12i-pooler.c-6.us-east-1.aws.neon.tech";
    var all = java.net.InetAddress.getAllByName(host);
    System.out.println("Resolved count=" + all.length);
    for (var a : all) {
      System.out.println(a.getHostAddress());
    }
  }
}
